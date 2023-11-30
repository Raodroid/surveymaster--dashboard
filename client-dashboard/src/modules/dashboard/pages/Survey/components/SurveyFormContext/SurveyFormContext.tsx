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
  EditSurveyBodyDto,
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
import {
  IEditSurveyFormValues,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import {
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
import {
  getParentBlockSort,
  getParentFieldName,
  transformToSurveyDataTreeNode,
} from '@pages/Survey';

const { confirm } = Modal;

interface ISurveyFormContext {
  setSurveyFormContext: Dispatch<SetStateAction<ISurveyFormContext>>;
  actionLoading: boolean;

  question: {
    questionVersionIdMap: Record<
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
    initialValues: IEditSurveyFormValues;
    onSubmit: (value: IEditSurveyFormValues) => void;
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
    isExternalProject: boolean;
    setExcelUploadFile: Dispatch<SetStateAction<string | Blob>>;
  };

  handleFocusBlock: (value: SurveyDataTreeNode | undefined) => void;
  handleExpendTree: (expendKeys: React.Key[]) => void;

  handleCloneSurveyVersion: (value: IPostSurveyVersionBodyDto) => void;
}

const intValue: ISurveyFormContext = {
  actionLoading: false,
  handleFocusBlock: (value: SurveyDataTreeNode | undefined) => {},
  handleExpendTree: (value: React.Key[]) => {},

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
  tree: {
    expendKeys: [],
  },
  survey: {},
  project: {
    isExternalProject: false,
    setExcelUploadFile: value => {},
  },
  setSurveyFormContext: function (
    value: React.SetStateAction<ISurveyFormContext>,
  ): void {
    throw new Error('Function not implemented.');
  },

  handleCloneSurveyVersion: () => {},
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
          > = { ...s.question.questionVersionIdMap };

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
              questionVersionIdMap: normalizeByQuestionId,
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

  const initialValues = useMemo<IEditSurveyFormValues>(() => {
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
      return SurveyService.updateSurveyVersion(data);
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

  const duplicateSurveyVersionMutation = useMutation(
    (data: IPostSurveyVersionBodyDto & { surveyId: string }) => {
      return SurveyService.createSurveyVersion(data);
    },
    {
      onSuccess: async res => {
        notification.success({
          message: t('common.createSuccess'),
        });
        const newVersion = res.data;

        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT, {
            projectId: params.projectId,
            surveyId: newVersion.surveyId,
          }) + `?version=${newVersion.displayId}`,
        );
      },
      onError,
    },
  );

  const [loading, toggleLoading] = useToggle();

  const handleCloneSurveyVersion = useCallback(
    (value: IPostSurveyVersionBodyDto) => {
      confirm({
        icon: null,
        content: t('common.confirmCloneSurveyVersion'),
        onOk() {
          duplicateSurveyVersionMutation.mutateAsync({
            ...value,
            surveyId: params.surveyId as string,
          });
          return;
        },
        onCancel() {
          return;
        },
      });
    },
    [duplicateSurveyVersionMutation, params.surveyId, t],
  );

  const actionLoading =
    mutationUploadExcelFile.isLoading ||
    duplicateSurveyVersionMutation.isLoading ||
    updateSurveyMutation.isLoading ||
    addSurveyVersionMutation.isLoading;

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
              sort: res.length + 1,
              remarks: q.remarks,
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

          await updateSurveyMutation.mutateAsync({
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

        await updateSurveyMutation.mutateAsync({
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
      navigate,
      toggleLoading,
      isExternalProject,
      currentSurveyVersion?.status,
      currentSurveyVersion?.id,
      t,
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

  return (
    <SurveyFormContext.Provider
      value={{
        ...context,
        setSurveyFormContext: setContext,
        actionLoading,
        handleFocusBlock,
        handleExpendTree,
        handleCloneSurveyVersion,
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
          isExternalProject: project.type === ProjectTypes.EXTERNAL,
          setExcelUploadFile,
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
