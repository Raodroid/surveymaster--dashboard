import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { onError, useToggle } from '@/utils';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { QuestionBankService, SurveyService } from '@/services';
import {
  CreateSurveyBodyDto,
  GetListQuestionDto,
  IPaginationResponse,
  IPostSurveyVersionBodyDto,
  IProject,
  IPutSurveyVersionBodyDtoExtendId,
  IQuestion,
  IQuestionVersion,
  ISurvey,
  ISurveyQuestionDto,
  ISurveyVersion,
  ProjectTypes,
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
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import {
  isSurveyFlowChange,
  transformInitSurveyFormData,
  useCheckSurveyFormMode,
} from '@pages/Survey/SurveyForm/util';
import HannahCustomSpin from '@components/HannahCustomSpin';
import { ROUTE_PATH } from '@/enums';
import { Modal, notification } from 'antd';
import {
  createQuestionMap,
  transformSurveyVersion,
} from '@pages/Survey/components/SurveyFormContext/util';

const { confirm } = Modal;

interface ISurveyFormContext {
  setSurveyFormContext: Dispatch<SetStateAction<ISurveyFormContext>>;
  isExternalProject: boolean;
  actionLoading: boolean;

  question: {
    questionIdMap: Record<
      string,
      IQuestionVersion & { masterCategory: IQuestion['masterCategory'] }
    >;
    newQuestions: Array<
      IQuestionVersion & {
        masterCategory: IQuestion['masterCategory'];
      }
    >;
    fetchNextQuestionPage: () => void;
    hasNextQuestionPage: boolean;
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
  tree: {
    focusBlock?: SurveyDataTreeNode;
    expendKeys: React.Key[];
  };

  survey: {
    currentSurveyVersion?: ISurveyVersion;
    surveyData?: ISurvey;
  };
  project: {
    projectData?: IProject;
  };

  handleFocusBlock: (value: SurveyDataTreeNode | undefined) => void;
  handleExpendTree: (expendKeys: React.Key[]) => void;
}

const intValue: ISurveyFormContext = {
  actionLoading: false,
  isExternalProject: false,

  handleFocusBlock: (value: SurveyDataTreeNode | undefined) => {},
  handleExpendTree: (value: React.Key[]) => {},
  question: {
    setSearchParams<T extends keyof GetListQuestionDto>(
      value: Record<T, GetListQuestionDto[T]>,
    ): void {},
    newQuestions: [],
    questionIdMap: {},
    hasNextQuestionPage: false,
    fetchNextQuestionPage: () => {},
    isFetchingQuestion: false,
    searchParams: {
      q: '',
      take: 20,
      page: 1,
      hasLatestCompletedVersion: true,
      isDeleted: false,
    },
  },
  form: {
    onSubmit(value: IAddSurveyFormValues): void {},
    initialValues: {} as IAddSurveyFormValues,
  },
  tree: {
    expendKeys: [],
  },
  survey: {},
  project: {},
  setSurveyFormContext: function (
    value: React.SetStateAction<ISurveyFormContext>,
  ): void {
    throw new Error('Function not implemented.');
  },
};

export const SurveyFormContext = createContext<ISurveyFormContext>(intValue);

const SurveyFormProvider = (props: { children?: ReactElement }) => {
  const [context, setContext] = useState<ISurveyFormContext>(intValue);

  const { isFetching, fetchNextPage } = useInfiniteQuery(
    ['getQuestionList', context.question.searchParams],
    ({ pageParam = context.question.searchParams }) => {
      return QuestionBankService.getQuestions({
        ...pageParam,
      });
    },
    {
      getNextPageParam: lastPage => {
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

          const normalizeByQuestionId: Record<
            string,
            IQuestionVersion & { masterCategory: IQuestion['masterCategory'] }
          > = { ...s.question.questionIdMap };

          const newQuestions: Array<
            IQuestionVersion & { masterCategory: IQuestion['masterCategory'] }
          > = [];
          questionListData.pages.forEach(page => {
            page.data.data.forEach(q => {
              newQuestions.push({
                ...q.latestCompletedVersion,
                masterCategory: q.masterCategory,
              });
            });
          });

          questionListData.pages.at(-1)?.data?.data.forEach((q: IQuestion) => {
            const latestQuestionVersionId = q.latestCompletedVersion
              ?.id as string;

            if (!normalizeByQuestionId[latestQuestionVersionId]) {
              normalizeByQuestionId[latestQuestionVersionId] = {
                ...q.latestCompletedVersion,
                masterCategory: q.masterCategory,
              };
            }
          });

          return {
            ...s,
            question: {
              ...s.question,
              newQuestions,
              hasNextQuestionPage:
                !!questionListData.pages.at(-1)?.data?.hasNextPage,
              fetchNextQuestionPage: fetchNextPage,
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
          // await addSurveyMutation.mutateAsync({
          //   projectId,
          //   version: {
          //     name: values.version?.name,
          //     remark: values.version?.remark,
          //     surveyFlowElements: transformSurveyFlowValues,
          //     status: SurveyVersionStatus.COMPLETED,
          //   },
          // });
          // return;
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

          await updateSurveyMutation.mutateAsync({
            ...transformValue.version,
            surveyVersionId: currentSurveyVersion?.id as string,
            name: transformValue.version?.name || '',
            status: transformValue.version?.status || SurveyVersionStatus.DRAFT,
            remark: transformValue.version?.remark || null,
          });
          return;
        }

        // if (values.template === SurveyTemplateEnum.DUPLICATE) {
        //   await duplicateSurveyMutation.mutateAsync({
        //     version: {
        //       name: transformValue.version?.name,
        //       remark: transformValue.version?.remark,
        //     },
        //     projectId: params.projectId as string,
        //     surveyId: duplicateSurveyId as string,
        //   });
        //   return;
        // }
        //
        // if (values.template === SurveyTemplateEnum.NEW) {
        //   await addSurveyMutation.mutateAsync(transformValue);
        //   return;
        // }
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
      currentSurveyVersion?.status,
      currentSurveyVersion?.id,
      t,
      addSurveyVersionMutation,
      params.surveyId,
      updateSurveyMutation,
    ],
  );

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

  const handleFocusBlock = useCallback(
    (node: SurveyDataTreeNode | undefined) => {
      setContext(s => ({ ...s, tree: { ...s.tree, focusBlock: node } }));
    },
    [],
  );
  const handleExpendTree = useCallback((expandedKeysValue: React.Key[]) => {
    setContext(s => ({
      ...s,
      tree: { ...s.tree, expendKeys: expandedKeysValue },
    }));
  }, []);

  useEffect(() => {
    setContext(s => {
      const questionIdMap = s.question.questionIdMap;

      createQuestionMap(
        currentSurveyVersion?.surveyFlowElements,
        questionIdMap,
      );
      return {
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
      };
    });
  }, [currentSurveyVersion?.surveyFlowElements]);

  return (
    <SurveyFormContext.Provider
      value={{
        ...context,
        setSurveyFormContext: setContext,
        actionLoading,
        handleFocusBlock,
        handleExpendTree,
        form: {
          ...context.form,
          initialValues,
          onSubmit,
        },
        question: {
          ...context.question,
          setSearchParams,
          isFetchingQuestion: isFetching,
        },
        survey: {
          currentSurveyVersion,
          surveyData,
        },
        project: {
          projectData: project,
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

export { SurveyFormProvider };
