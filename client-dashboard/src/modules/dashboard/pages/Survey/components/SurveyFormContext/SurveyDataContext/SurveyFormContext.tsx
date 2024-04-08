import {
  createContext,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onError, useToggle } from '@/utils';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { QuestionBankService, SurveyService } from '@/services';
import {
  EditSurveyBodyDto,
  GetListQuestionDto,
  IPaginationResponse,
  IPostSurveyVersionBodyDto,
  IPutSurveyVersionBodyDtoExtendId,
  IQuestion,
  IQuestionVersion,
  ISurveyQuestionDto,
  ISurveyVersion,
  ISurveyVersionBaseDto,
  ProjectTypes,
  SubSurveyFlowElement,
  SurveyVersionStatus,
} from '@/type';
import { generatePath, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';
import { useGetProjectByIdQuery } from '@pages/Project/util';
import { IEditSurveyFormValues } from '@pages/Survey/SurveyForm/type';

import {
  transformInitSurveyFormData,
  useCheckSurveyFormMode,
} from '@pages/Survey/SurveyForm/util';

import { ROUTE_PATH } from '@/enums';
import { Modal, notification, Spin } from 'antd';
import {
  createQuestionMap,
  findMaxBlockSort,
  transformCloneSurveyVersion,
  transformSurveyVersion,
} from './util';
import { useSurveyTreeContext } from '@pages/Survey';
import { ISurveyFormContext } from './type';

const { confirm } = Modal;

const intValueContext: ISurveyFormContext = {
  actionLoading: false,

  question: {
    setSearchParams<T extends keyof GetListQuestionDto>(
      value: Record<T, GetListQuestionDto[T]>,
    ): void {},
    newQuestions: [],
    questionVersionIdMap: {},
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
    onSubmit(value: IEditSurveyFormValues): void {},
    initialValues: {} as IEditSurveyFormValues,
  },
  survey: {},
  project: {
    isExternalProject: false,
  },
  setSurveyFormContext: function (
    value: SetStateAction<ISurveyFormContext>,
  ): void {
    throw new Error('Function not implemented.');
  },

  handleCloneSurveyVersion: () => {},
};
export const SurveyFormContext =
  createContext<ISurveyFormContext>(intValueContext);

const SurveyFormProvider = (props: { children?: ReactElement }) => {
  const [context, setContext] = useState<ISurveyFormContext>(intValueContext);
  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const projectId = params.projectId || '';

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isEditMode } = useCheckSurveyFormMode();
  const { mutateAsync: updateSurveyMutate, isLoading: updateSurveyLoading } =
    useMutation(
      (data: IPutSurveyVersionBodyDtoExtendId) => {
        return SurveyService.updateSurveyVersion(data);
      },
      {
        onSuccess: async res => {
          await onSuccess();
          navigate(
            generatePath(
              ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
              {
                projectId: params.projectId,
                surveyId: params.surveyId,
              },
            ) + `?version=${res.data.displayId}`,
          );
        },
        onError,
      },
    );

  const {
    mutateAsync: duplSurveyVersionMutate,
    isLoading: duplSurveyVersionLoading,
  } = useMutation(
    (data: IPostSurveyVersionBodyDto & { surveyId: string }) => {
      return SurveyService.createSurveyVersion(data);
    },
    {
      onSuccess: async res => {
        notification.success({
          message: t('common.createSuccess'),
        });
        const newVersion: ISurveyVersion = res.data;
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT, {
            projectId: params.projectId,
            surveyId: newVersion?.surveyId,
          }) + `?version=${newVersion?.displayId}`,
        );
      },
      onError,
    },
  );

  //handle get question infinity
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
        setContext(oldState => {
          if (!questionListData) return oldState;

          const normalizeByQuestionId: Record<
            string,
            IQuestionVersion & { masterCategory: IQuestion['masterCategory'] }
          > = { ...oldState.question.questionVersionIdMap };

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

          const newQuestions: Array<
            IQuestionVersion & { masterCategory: IQuestion['masterCategory'] }
          > = [];

          questionListData.pages.forEach(page => {
            page.data.data.forEach(q => {
              if (!normalizeByQuestionId[q.latestCompletedVersion.id as string])
                //make sure context store this question
                return;

              newQuestions.push({
                ...q.latestCompletedVersion,
                masterCategory: q.masterCategory,
              });
            });
          });

          return {
            ...oldState,
            question: {
              ...oldState.question,
              newQuestions,
              hasNextQuestionPage:
                !!questionListData.pages.at(-1)?.data?.hasNextPage,
              fetchNextQuestionPage: fetchNextPage,
              questionVersionIdMap: normalizeByQuestionId,
            },
          };
        });
      },
    },
  );

  const {
    isLoading: isFetchingSurveyData,
    currentSurveyVersion,
    surveyData,
  } = useGetSurveyById(params?.surveyId);

  const { project, isLoading: isFetchingProject } = useGetProjectByIdQuery(
    params?.projectId,
  );
  const { setSurveyTreeContext } = useSurveyTreeContext();

  const isExternalProject = useMemo(
    () => project.type === ProjectTypes.EXTERNAL,
    [project.type],
  );

  const setSearchParams = useCallback((value: GetListQuestionDto) => {
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

  const initialFormValues = useMemo<IEditSurveyFormValues>(() => {
    return {
      ...transformInitSurveyFormData(currentSurveyVersion),
      projectId,
      surveyId: surveyData.displayId || '',
      selectedRowKeys: !isExternalProject
        ? []
        : (
            currentSurveyVersion?.surveyFlowElements?.[0]?.surveyQuestions || []
          ).map(q => q.questionVersionId),
    };
  }, [
    currentSurveyVersion,
    isExternalProject,
    projectId,
    surveyData.displayId,
  ]);

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries('getProjects');
    await queryClient.invalidateQueries('getSurveyById');

    notification.success({
      message: t(`common.${isEditMode ? 'updateSuccess' : 'createSuccess'}`),
    });
  }, [isEditMode, queryClient, t]);

  // loading state of context
  const [loading, toggleLoading] = useToggle();

  const handleCloneSurveyVersion = useCallback(
    (value: IPostSurveyVersionBodyDto) => {
      confirm({
        icon: null,
        content: t('common.confirmCloneSurveyVersion'),
        onOk() {
          duplSurveyVersionMutate({
            ...value,
            surveyFlowElements: transformCloneSurveyVersion(
              value.surveyFlowElements,
            ),
            surveyId: params.surveyId as string,
          });
          return;
        },
        onCancel() {
          return;
        },
      });
    },
    [duplSurveyVersionMutate, params.surveyId, t],
  );
  const actionLoading = duplSurveyVersionLoading || updateSurveyLoading;

  const onSubmit = useCallback(
    async (values: IEditSurveyFormValues) => {
      const { version, selectedRowKeys } = values;

      if (!values.projectId) {
        console.error('ProjectId is null');
        navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
        return;
      }
      if (values.version?.surveyFlowElements?.length === 0) {
        notification.error({ message: t('direction.emptyElementError') });
        return;
      }
      if (currentSurveyVersion?.status === SurveyVersionStatus.COMPLETED) {
        console.error('can not update completed version');
        return;
      }
      try {
        toggleLoading();
        if (isExternalProject) {
          if (!selectedRowKeys || !selectedRowKeys.length) return;

          const transformSurveyQuestions: ISurveyQuestionDto[] = (
            version?.surveyFlowElements?.[0].surveyQuestions || []
          ).reduce((res: ISurveyQuestionDto[], q) => {
            if (!selectedRowKeys.some(key => key === q.questionVersionId)) {
              return res;
            }
            const newItem: ISurveyQuestionDto = {
              id: q.id,
              sort: res.length + 1,
              remarks: q.remarks?.length === 0 ? undefined : q.remarks,
              questionVersionId: q.questionVersionId,
              parameter: q.parameter,
            };
            return [...res, newItem];
          }, []);

          const transformValues: ISurveyVersionBaseDto = {
            status: SurveyVersionStatus.DRAFT,
            surveyFlowElements: [
              {
                type: SubSurveyFlowElement.BLOCK,
                sort: 0,
                blockSort: 0,
                blockDescription: '',
                surveyQuestions: transformSurveyQuestions,
              },
            ],
            name: values.version?.name as string,
            remarks:
              values.version?.remarks?.length === 0
                ? undefined
                : values.version?.remarks,
          };

          await updateSurveyMutate({
            ...transformValues,
            surveyVersionId: currentSurveyVersion?.id as string,
            status: values.version?.status || SurveyVersionStatus.DRAFT,
          });
          return;
        }

        const transformValue: EditSurveyBodyDto = {
          version: transformSurveyVersion(values),
          projectId: values.projectId,
        };

        await updateSurveyMutate({
          ...transformValue.version,
          surveyVersionId: currentSurveyVersion?.id as string,
          name: transformValue.version?.name || '',
          status: transformValue.version?.status || SurveyVersionStatus.DRAFT,
        });
      } finally {
        toggleLoading();
      }
    },
    [
      currentSurveyVersion?.status,
      currentSurveyVersion?.id,
      navigate,
      t,
      toggleLoading,
      isExternalProject,
      updateSurveyMutate,
    ],
  );

  //Get and transform all questions was existed in current survey version, put into questionVersionIdMap
  useEffect(() => {
    setContext(s => {
      const questionIdMap = s.question.questionVersionIdMap;

      createQuestionMap(
        currentSurveyVersion?.surveyFlowElements,
        questionIdMap,
      );
      return {
        ...s,
        question: {
          ...s.question,
          questionVersionIdMap: {
            ...s.question.questionVersionIdMap,
            ...questionIdMap,
          },
        },
        form: {
          ...s.form,
        },
      };
    });
  }, [currentSurveyVersion?.surveyFlowElements]);

  // find MaxBlockSort and set to context
  useEffect(() => {
    if (!currentSurveyVersion) return;

    const { surveyFlowElements } = currentSurveyVersion;
    if (!surveyFlowElements?.length) return;

    const maxBlockSort = findMaxBlockSort(surveyFlowElements);

    setSurveyTreeContext(s => ({
      ...s,
      tree: {
        ...s.tree,
        maxBlockSort,
      },
    }));
  }, [currentSurveyVersion, setSurveyTreeContext]);

  return (
    <SurveyFormContext.Provider
      value={{
        ...context,
        setSurveyFormContext: setContext,
        actionLoading,
        handleCloneSurveyVersion,
        form: {
          ...context.form,
          initialValues: initialFormValues,
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
          isExternalProject: project.type === ProjectTypes.EXTERNAL,
        },
      }}
    >
      <Spin
        spinning={loading || isFetchingSurveyData || isFetchingProject}
        style={{ maxHeight: 'unset' }}
      >
        <div className={'h-full'}>{props.children}</div>
      </Spin>
    </SurveyFormContext.Provider>
  );
};

export { SurveyFormProvider };
