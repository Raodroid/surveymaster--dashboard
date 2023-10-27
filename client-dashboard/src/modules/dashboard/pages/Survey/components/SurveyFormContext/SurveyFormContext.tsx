import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { onError, useToggle } from '@/utils';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { QuestionBankService, SurveyService, UploadService } from '@/services';
import {
  CreateSurveyBodyDto,
  GetListQuestionDto,
  IOptionItem,
  IPaginationResponse,
  IPostSurveyVersionBodyDto,
  IPutSurveyVersionBodyDtoExtendId,
  IQuestion,
  IQuestionVersion,
  ISurveyQuestionDto,
  ISurveyVersion,
  ProjectTypes,
  SubSurveyFlowElement,
  SubSurveyFlowElementDto,
  SurveyVersionStatus,
} from '@/type';
import { generatePath, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';
import { useGetProjectByIdQuery } from '@pages/Project/util';
import {
  IAddSurveyFormValues,
  SurveyTemplateEnum,
} from '@pages/Survey/SurveyForm/type';
import {
  isSurveyFlowChange,
  transformInitSurveyFormData,
  useCheckSurveyFormMode,
} from '@pages/Survey/SurveyForm/util';
import HannahCustomSpin from '@components/HannahCustomSpin';
import { ROUTE_PATH } from '@/enums';
import { transformSurveyVersion } from '@pages/Survey/components/SurveyPlayGround/util';
import { Modal, notification } from 'antd';

const { confirm } = Modal;

interface ISurveyFormContext {
  setSurveyFormContext: <T extends keyof ISurveyFormContext>(
    value: Record<T, ISurveyFormContext[T]>,
  ) => void;
  isExternalProject: boolean;
  actionLoading: boolean;

  question: {
    questionIdMap: Record<string, IQuestionVersion>;
    fetchNextQuestionPage: () => void;
    hasNextQuestionPage: boolean;
    questionOptions: IOptionItem[];
    searchParams: GetListQuestionDto;
    isFetchingQuestion: boolean;
    setSearchParams: <T extends keyof GetListQuestionDto>(
      value: Record<T, GetListQuestionDto[T]>,
    ) => void;
  };

  form: {
    initialValues: IAddSurveyFormValues;
    onSubmit: (value: IAddSurveyFormValues) => void;
  };
}

const intValue: ISurveyFormContext = {
  actionLoading: false,
  isExternalProject: false,
  setSurveyFormContext: <T extends keyof ISurveyFormContext>(
    value: Record<T, ISurveyFormContext[T]>,
  ) => {},

  question: {
    setSearchParams<T extends keyof GetListQuestionDto>(
      value: Record<T, GetListQuestionDto[T]>,
    ): void {},

    questionIdMap: {},
    // selectedRowKeys,
    hasNextQuestionPage: false,
    fetchNextQuestionPage: () => {},
    questionOptions: [],
    isFetchingQuestion: false,
    searchParams: {
      q: '',
      take: 10,
      page: 1,
      hasLatestCompletedVersion: true,
      isDeleted: false,
    },
  },
  form: {
    onSubmit(value: IAddSurveyFormValues): void {},
    initialValues: {} as IAddSurveyFormValues,
  },
};

const SurveyFormContext = createContext<ISurveyFormContext>(intValue);

const createQuestionMap = (
  input: ISurveyVersion['surveyFlowElements'] = [],
  mapId: Record<string, IQuestionVersion>,
) => {
  input?.forEach(item => {
    item.surveyQuestions?.forEach(q => {
      const question = q.questionVersion;
      if (question) {
        mapId[q.questionVersionId] = question;
      }
    });

    if (item.children) {
      createQuestionMap(item.children, mapId);
    }
  });
};

const SurveyFormProvider = (props: { children?: ReactElement }) => {
  const [context, setContext] = useState<ISurveyFormContext>(intValue);

  const { isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['getQuestionList', context.question.searchParams],
    ({ pageParam = context.question.searchParams }) => {
      return QuestionBankService.getQuestions({
        ...pageParam,
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.hasNextPage
          ? { ...context.question.searchParams, page: lastPage.data.page + 1 }
          : false;
      },
      onError,
      refetchOnWindowFocus: false,
      onSuccess: res => {
        const questionListData = res as unknown as {
          pages: { data: IPaginationResponse<IQuestion> }[];
        };
        setContext(s => {
          if (!questionListData) return s;

          const normalizeByQuestionId: Record<string, IQuestionVersion> = {};
          const questionOptions = questionListData.pages.reduce(
            (current: IOptionItem[], page) => {
              (page.data?.data || []).forEach((q: IQuestion) => {
                const latestQuestionVersionId = q.latestCompletedVersion?.id;
                // const latestQuestionId = q?.id;
                // if (
                //   value?.some(
                //     z =>
                //       z.id === latestQuestionId || // check if chosen version is in the same question but different version
                //       z.questionVersionId === latestQuestionVersionId, //check and filter out questions were automatically filled after uploading file
                //   )
                // ) {
                //   return current;
                // }

                normalizeByQuestionId[latestQuestionVersionId as string] =
                  q.latestCompletedVersion;

                current.push({
                  label: q?.latestCompletedVersion?.title,
                  value: latestQuestionVersionId as string,
                });
              });
              return current;
            },
            [],
          );
          return {
            ...s,
            question: {
              ...s.question,
              hasNextQuestionPage: !!hasNextPage,
              fetchNextQuestionPage: fetchNextPage,
              questionOptions,
              questionIdMap: normalizeByQuestionId,
            },
          };
        });
      },
    },
  );

  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const projectId = params.projectId || '';

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isEditMode } = useCheckSurveyFormMode();

  const {
    isLoading: isFetchingSurveyData,
    currentSurveyVersion,
    surveyData,
  } = useGetSurveyById(params?.surveyId);

  const { project, isLoading: isFetchingProject } = useGetProjectByIdQuery(
    params?.projectId,
  );

  const isExternalProject = useMemo(
    () => project.type === ProjectTypes.EXTERNAL,
    [project.type],
  );
  const wrapperRef = useRef<any>();

  const initialValues = useMemo<IAddSurveyFormValues>(() => {
    return {
      ...transformInitSurveyFormData(currentSurveyVersion),
      projectId,
      surveyId: surveyData.displayId || '',
    };
  }, [currentSurveyVersion, projectId, surveyData?.displayId]);

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries('getProjects');
    await queryClient.invalidateQueries('getSurveyById');

    notification.success({
      message: t(`common.${isEditMode ? 'updateSuccess' : 'createSuccess'}`),
    });
  }, [isEditMode, queryClient, t]);

  const [excelUploadFile, setExcelUploadFile] = useState<string | Blob>('');

  const mutationUploadExcelFile = useMutation(
    (id: string) =>
      SurveyService.uploadExcelFile({
        id,
        file: excelUploadFile,
      }),
    {
      onError,
    },
  );

  const addSurveyMutation = useMutation(
    (data: CreateSurveyBodyDto) => {
      return SurveyService.createSurvey(data);
    },
    {
      onSuccess: async res => {
        const newVersion = res.data.versions[0];
        const fileType = 'application/octet-stream';

        if (excelUploadFile) {
          const file = excelUploadFile as Blob;
          const res = await SurveyService.getSignedUrl({
            filename: file['name'] as string,
            surveyVersionId: newVersion.id,
            fileType: fileType,
          });
          const { data } = res;
          await UploadService.putWithFormFileAsync(data.url, file, fileType);
          // await mutationUploadExcelFile.mutateAsync(newVersion.id);
        }
        await onSuccess();

        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: newVersion.surveyId,
          }) + `?version=${newVersion.displayId}`,
        );
      },
      onError,
    },
  );

  const addSurveyVersionMutation = useMutation(
    (data: IPostSurveyVersionBodyDto) => {
      return SurveyService.createSurveyVersion(data);
    },
    {
      onSuccess: async res => {
        await onSuccess();
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: res.data.surveyId,
          }) + `?version=${res.data.displayId}`,
        );
      },
      onError,
    },
  );

  const updateSurveyMutation = useMutation(
    (data: IPutSurveyVersionBodyDtoExtendId) => {
      return SurveyService.updateSurvey(data);
    },
    {
      onSuccess: async res => {
        await onSuccess();
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: params.surveyId,
          }) + `?version=${res.data.displayId}`,
        );
      },
      onError,
    },
  );

  const duplicateSurveyMutation = useMutation(
    (data: CreateSurveyBodyDto & { surveyId: string }) => {
      return SurveyService.duplicateSurvey(data);
    },
    {
      onSuccess: async res => {
        const newVersion = res.data.versions[0];
        await onSuccess();

        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: newVersion.surveyId,
          }) + `?version=${newVersion.displayId}`,
        );
      },
      onError,
    },
  );

  const [loading, toggleLoading] = useToggle();

  const actionLoading =
    mutationUploadExcelFile.isLoading ||
    duplicateSurveyMutation.isLoading ||
    addSurveyMutation.isLoading ||
    updateSurveyMutation.isLoading ||
    addSurveyVersionMutation.isLoading;

  const onSubmit = useCallback(
    async (values: IAddSurveyFormValues) => {
      const { version, duplicateSurveyId } = values;

      const { initialValues } = context.form;

      if (!values.projectId) {
        console.error('ProjectId is null');
        navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
        return;
      }
      try {
        toggleLoading();
        if (isExternalProject) {
          const transformSurveyFlowValues: SubSurveyFlowElementDto[] = (
            version?.surveyFlowElements || []
          ).map(flow => ({
            ...flow,
            surveyQuestions: (flow.surveyQuestions || []).reduce(
              (res: ISurveyQuestionDto[], q) => {
                // if (
                //   selectedRowKeys &&
                //   !selectedRowKeys.some(key => key === q.questionVersionId)
                // ) {
                //   return res;
                // }
                return [
                  ...res,
                  {
                    sort: res.length + 1,
                    remark: q.remark,
                    questionVersionId: q.questionVersionId,
                    parameter: q.parameter,
                  },
                ];
              },
              [],
            ),
          }));

          // if (isEditMode) {
          //   if (
          //     currentSurveyVersion?.status === SurveyVersionStatus.COMPLETED &&
          //     isSurveyFlowChange(
          //       questions,
          //       initialValues.version.questions,
          //     )
          //   ) {
          //     confirm({
          //       icon: null,
          //       content: t('common.confirmCreateNewExternalSurveyVersion'),
          //       onOk() {
          //         addSurveyVersionMutation.mutateAsync({
          //           surveyId: params.surveyId as string,
          //           ...transformSurveyFlowValues.version,
          //           status: SurveyVersionStatus.DRAFT,
          //         });
          //         return;
          //       },
          //       onCancel() {
          //         return;
          //       },
          //     });
          //
          //     return;
          //   }
          //
          //   await updateSurveyMutation.mutateAsync({
          //     ...transformSurveyFlowValues.version,
          //     surveyVersionId: currentSurveyVersion?.id as string,
          //     name: transformSurveyFlowValues.version?.name || '',
          //     questions: transformSurveyFlowValues.version?.questions || [],
          //     status: transformSurveyFlowValues.version?.status || SurveyVersionStatus.DRAFT,
          //     remark: transformSurveyFlowValues.version.remark || null,
          //   });
          //   return;
          // }
          await addSurveyMutation.mutateAsync({
            projectId,
            version: {
              name: values.version?.name,
              remark: values.version?.remark,
              surveyFlowElements: transformSurveyFlowValues,
              status: SurveyVersionStatus.COMPLETED,
            },
          });
          return;
        }
        const transformValue: CreateSurveyBodyDto = {
          version: transformSurveyVersion(values),
          projectId: values.projectId,
        };
        if (isEditMode) {
          if (
            currentSurveyVersion?.status === SurveyVersionStatus.COMPLETED &&
            isSurveyFlowChange(
              version?.surveyFlowElements,
              initialValues.version?.surveyFlowElements,
            )
          ) {
            confirm({
              icon: null,
              content: t('common.confirmCreateNewSurveyVersion'),
              onOk() {
                addSurveyVersionMutation.mutateAsync({
                  surveyId: params.surveyId as string,
                  ...transformValue.version,
                });
              },
            });
            return;
          }
        }

        if (isEditMode) {
          await updateSurveyMutation.mutateAsync({
            ...transformValue.version,
            surveyVersionId: currentSurveyVersion?.id as string,
            name: transformValue.version?.name || '',
            status: transformValue.version?.status || SurveyVersionStatus.DRAFT,
            remark: transformValue.version?.remark || null,
          });
          return;
        }

        if (values.template === SurveyTemplateEnum.DUPLICATE) {
          await duplicateSurveyMutation.mutateAsync({
            version: {
              name: transformValue.version?.name,
              remark: transformValue.version?.remark,
            },
            projectId: params.projectId as string,
            surveyId: duplicateSurveyId as string,
          });
          return;
        }

        if (values.template === SurveyTemplateEnum.NEW) {
          await addSurveyMutation.mutateAsync(transformValue);
          return;
        }
      } finally {
        toggleLoading();
      }
    },
    [
      context.form,
      navigate,
      toggleLoading,
      isExternalProject,
      isEditMode,
      addSurveyMutation,
      projectId,
      currentSurveyVersion?.status,
      currentSurveyVersion?.id,
      t,
      addSurveyVersionMutation,
      params.surveyId,
      params.projectId,
      updateSurveyMutation,
      duplicateSurveyMutation,
    ],
  );

  const setSurveyFormContext = useCallback(value => {
    setContext(s => ({ ...s, ...value }));
  }, []);

  const setSearchParams = useCallback(value => {
    setContext(s => ({
      ...s,
      question: {
        ...s.question,
        searchParams: {
          ...s.question.searchParams,
          ...value,
        },
      },
    }));
  }, []);

  useEffect(() => {
    const questionIdMap = {};

    createQuestionMap(currentSurveyVersion?.surveyFlowElements, questionIdMap);

    setContext(s => ({
      ...s,
      question: {
        ...s.question,
        questionIdMap: {
          ...s.question.questionIdMap,
          ...questionIdMap,
        },
      },
      form: {
        ...s.form,
      },
    }));
  }, [currentSurveyVersion?.surveyFlowElements]);

  return (
    <SurveyFormContext.Provider
      value={{
        ...context,
        setSurveyFormContext,
        actionLoading,
        form: {
          ...context.form,
          initialValues,
          onSubmit,
        },
        question: {
          ...context.question,
          setSearchParams,
          isFetchingQuestion: isLoading,
        },
      }}
    >
      <div ref={wrapperRef} className={'h-full'}>
        <HannahCustomSpin
          parentRef={wrapperRef}
          spinning={loading || isFetchingSurveyData || isFetchingProject}
        />
        {props.children}
      </div>
    </SurveyFormContext.Provider>
  );
};

const useSurveyFormContext = () => {
  return useContext(SurveyFormContext);
};

export { SurveyFormProvider, useSurveyFormContext };
