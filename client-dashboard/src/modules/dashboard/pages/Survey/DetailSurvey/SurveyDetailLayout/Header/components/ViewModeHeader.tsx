import { useCallback, useMemo } from 'react';
import { ProjectHeader } from '@pages/Project';
import {
  createDuplicateSurveyVersionName,
  handleExportSurvey,
  RequestCompleteSurveyModal,
  RequestDeleteSurveyVersionModal,
  SurveyRenameModal,
  SurveyVersionRemarkButton,
  useSurveyFormContext,
} from '@pages/Survey';
import { Modal, notification, Spin } from 'antd';
import {
  IGetParams,
  IRequestDeleteRecordDto,
  ISurveyVersion,
  IUpdateSurveyVersionStatusDto,
  SubSurveyFlowElementDto,
  SurveyVersionStatus,
} from '@/type';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router';
import { EntityEnum, ROUTE_PATH } from '@/enums';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError, useToggle } from '@/utils';
import { keysAction, useParseQueryString, useSelectTableRecord } from '@/hooks';
import {
  ACTION,
  ActionThreeDropDown,
} from './SurveyVersionActionThreeDropdown';
import { projectSurveyParams } from '@pages/Survey/DetailSurvey/DetailSurvey';
import { IBreadcrumbItem, useCheckScopeEntityDefault } from '@/modules/common';
import { transSurveyFLowElement } from '@pages/Survey/components/SurveyFormContext/SurveyDataContext/util';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';

const { confirm } = Modal;

const ViewModeHeader = () => {
  const params = useParams<{ projectId?: string; surveyId?: string }>();

  const { survey, project } = useSurveyFormContext();

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.projectData?.name || '...',
        href: generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: survey.currentSurveyVersion?.name || '...',
        href: `${generatePath(
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
          {
            projectId: params?.projectId,
            surveyId: params.surveyId,
          },
        )}?version=${survey.currentSurveyVersion?.id}`,
      },
    ],
    [
      params?.projectId,
      params.surveyId,
      project?.projectData?.name,
      survey.currentSurveyVersion?.id,
      survey.currentSurveyVersion?.name,
    ],
  );

  return (
    <>
      <ProjectHeader
        RightMenu={<RightMenu />}
        routes={routes}
        showDetailSurveyBtn
        showSurveyVersions
      />
    </>
  );
};

export default ViewModeHeader;

const RightMenu = () => {
  const { t } = useTranslation();
  const qsParams = useParseQueryString<IGetParams & { version?: string }>();
  const params = useParams<projectSurveyParams>();
  const { survey, handleCloneSurveyVersion } = useSurveyFormContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { canUpdate } = useCheckScopeEntityDefault(EntityEnum.SURVEY);
  const [openRenameModal, toggleRenameModal] = useToggle();
  const [
    openRequestCompleteVersionModal,
    toggleOpenRequestCompleteVersionModal,
  ] = useToggle();
  const [openRequestDeleteVersionModal, toggleOpenRequestDeleteVersionModal] =
    useToggle();
  const profile = useSelector(AuthSelectors.getProfile);

  const deleteMutation = useMutation(
    (data: { id: string }) => {
      return SurveyService.deleteSurveyVersion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.deleteSuccess') });
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
            projectId: params.projectId,
          }),
        );
      },
      onError,
    },
  );
  const requestDeleteSurvey = useMutation(
    (data: IRequestDeleteRecordDto) => {
      return SurveyService.requestDeleteSurveyVersion({
        ...data,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.denySuccess') });
      },
      onError,
    },
  );

  const changeSurveyVersionStatusMutation = useMutation(
    (data: IUpdateSurveyVersionStatusDto & { surveyVersionId: string }) => {
      return SurveyService.updateStatusSurveyVersion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.updateSuccess') });
      },
      onError,
    },
  );
  const handleDelete = useCallback(
    (record: ISurveyVersion) => {
      confirm({
        icon: null,
        content: t('common.confirmDeleteSurveyVersion'),
        onOk() {
          deleteMutation.mutateAsync({ id: record.id as string });
        },
      });
    },
    [deleteMutation, t],
  );
  const [isExporting, toggleExporting] = useToggle();
  const handleExport = useCallback(
    async (record: ISurveyVersion) => {
      try {
        toggleExporting();
        await handleExportSurvey(record);
      } finally {
        toggleExporting();
      }
    },
    [toggleExporting],
  );
  const handleResponseCompleteRequest = useCallback(
    (type: 'APPROVE' | 'DENY', record: ISurveyVersion) => {
      confirm({
        icon: null,
        content: t('common.confirmCompleteSurveyVersion'),
        onOk() {
          changeSurveyVersionStatusMutation.mutateAsync({
            status:
              type === 'APPROVE'
                ? SurveyVersionStatus.COMPLETED
                : SurveyVersionStatus.DRAFT,
            approvalUserId: profile?.id as string,
            surveyVersionId: record.id as string,
          });
        },
      });
    },
    [changeSurveyVersionStatusMutation, profile?.id, t],
  );

  const handleResponseDeleteRequest = useCallback(
    (type: 'APPROVE' | 'DENY', record: ISurveyVersion) => {
      if (type === 'APPROVE') {
        handleDelete(record);
        return;
      }
      confirm({
        icon: null,
        content: t('common.confirmDenyDeleteSurveyVersion'),
        onOk() {
          requestDeleteSurvey.mutateAsync({
            id: record.id as string,
            isAwaitingDeletion: false,
          });
        },
      });
    },
    [handleDelete, requestDeleteSurvey, t],
  );

  const handleCLone = useCallback(
    (record: ISurveyVersion) => {
      if (!record?.id) return;

      const surveyFlowElements: SubSurveyFlowElementDto[] =
        transSurveyFLowElement(record.surveyFlowElements || []);

      handleCloneSurveyVersion({
        name: createDuplicateSurveyVersionName(record.name),
        surveyFlowElements,
        status: SurveyVersionStatus.DRAFT,
        surveyId: record?.id,
      });
    },
    [handleCloneSurveyVersion],
  );

  const handleShowChangeLog = useCallback(() => {
    navigate(
      `${generatePath(
        ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.HISTORY,
        {
          projectId: params.projectId,
          surveyId: params.surveyId,
        },
      )}?version=${qsParams.version}`,
    );
  }, [navigate, params.projectId, params.surveyId, qsParams.version]);

  const handleEdit = useCallback(() => {
    navigate(
      `${generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT, {
        projectId: params.projectId,
        surveyId: params.surveyId,
      })}?version=${qsParams.version}`,
    );
  }, [navigate, params.projectId, params.surveyId, qsParams.version]);

  const tableActions = useMemo<keysAction<ISurveyVersion>>(
    () => [
      {
        key: ACTION.DELETE,
        action: handleDelete,
      },
      {
        key: ACTION.EXPORT,
        action: handleExport,
      },

      {
        key: ACTION.APPROVE_COMPLETE_REQUEST,
        action: record => {
          handleResponseCompleteRequest('APPROVE', record);
        },
      },
      {
        key: ACTION.DENY_COMPLETE_REQUEST,
        action: record => {
          handleResponseCompleteRequest('DENY', record);
        },
      },
      {
        key: ACTION.CLONE,
        action: handleCLone,
      },
      {
        key: ACTION.SHOW_CHANGE_LOG,
        action: handleShowChangeLog,
      },
      {
        key: ACTION.EDIT,
        action: handleEdit,
      },
      {
        key: ACTION.RENAME,
        action: toggleRenameModal,
      },
      {
        key: ACTION.REQUEST_COMPLETE,
        action: toggleOpenRequestCompleteVersionModal,
      },
      {
        key: ACTION.REQUEST_DELETE,
        action: toggleOpenRequestDeleteVersionModal,
      },
      {
        key: ACTION.APPROVE_DELETE_REQUEST,
        action: record => {
          handleResponseDeleteRequest('APPROVE', record);
        },
      },
      {
        key: ACTION.DENY_DELETE_REQUEST,
        action: record => {
          handleResponseDeleteRequest('DENY', record);
        },
      },
    ],
    [
      handleDelete,
      handleExport,
      handleCLone,
      handleShowChangeLog,
      handleEdit,
      toggleRenameModal,
      toggleOpenRequestCompleteVersionModal,
      toggleOpenRequestDeleteVersionModal,
      handleResponseCompleteRequest,
      handleResponseDeleteRequest,
    ],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<ISurveyVersion>(tableActions);

  return (
    <div className={'flex items-center'}>
      <SurveyVersionRemarkButton />
      {survey.currentSurveyVersion && (
        <Spin
          spinning={
            isExporting ||
            deleteMutation.isLoading ||
            changeSurveyVersionStatusMutation.isLoading ||
            requestDeleteSurvey.isLoading
          }
        >
          <ActionThreeDropDown
            record={survey.currentSurveyVersion}
            handleSelect={handleSelect}
            versionCount={survey.surveyData?.versions?.length || 0}
          />
        </Spin>
      )}
      <SurveyRenameModal
        open={openRenameModal}
        toggleOpen={toggleRenameModal}
        surveyId={params?.surveyId}
        versionId={selectedRecord?.id}
      />
      {canUpdate && (
        <RequestCompleteSurveyModal
          open={openRequestCompleteVersionModal}
          toggleOpen={toggleOpenRequestCompleteVersionModal}
          versionId={selectedRecord?.id}
        />
      )}
      {canUpdate && (
        <RequestDeleteSurveyVersionModal
          open={openRequestDeleteVersionModal}
          toggleOpen={toggleOpenRequestDeleteVersionModal}
          versionId={selectedRecord?.id}
        />
      )}
    </div>
  );
};
