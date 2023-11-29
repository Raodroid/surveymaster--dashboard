import React, { useCallback, useMemo } from 'react';
import { ProjectHeader } from '@pages/Project';
import {
  createDuplicateSurveyVersionName,
  SurveyVersionRemarkButton,
  useSurveyFormContext,
} from '@pages/Survey';
import { Modal, notification, Spin } from 'antd';
import { IGetParams, ISurveyVersion } from '@/type';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router';
import { MOMENT_FORMAT, ROUTE_PATH } from '@/enums';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError, saveBlob, useToggle } from '@/utils';
import _get from 'lodash/get';
import moment from 'moment';
import { keysAction, useParseQueryString, useSelectTableRecord } from '@/hooks';
import {
  ACTION,
  ActionThreeDropDown,
} from './SurveyVersionActionThreeDropdown';
import { projectSurveyParams } from '@pages/Survey/DetailSurvey/DetailSurvey';
import { IBreadcrumbItem } from '@/modules/common';

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
  const completeMutation = useMutation(
    (data: { surveyVersionId: string }) => {
      return SurveyService.updateStatusSurvey(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.updateSuccess') });
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
            projectId: params.projectId,
          }),
        );
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
        const response = await SurveyService.getSurveyFile(record.id as string);
        const data: {
          SurveyElements: any[];
          SurveyEntry: { SurveyName: string };
        } = _get(response, 'data', {});
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/octet-stream',
        });
        saveBlob(
          blob,
          `${data.SurveyEntry.SurveyName}-${moment().format(
            MOMENT_FORMAT.EXPORT,
          )}.qsf`,
        );
      } catch (error) {
        console.error({ error });
      } finally {
        toggleExporting();
      }
    },
    [toggleExporting],
  );
  const handleComplete = useCallback(
    (record: ISurveyVersion) => {
      confirm({
        icon: null,
        content: t('common.confirmCompleteSurveyVersion'),
        onOk() {
          completeMutation.mutateAsync({
            surveyVersionId: record.id as string,
          });
        },
      });
    },
    [completeMutation, t],
  );
  const handleCLone = useCallback(
    (record: ISurveyVersion) => {
      if (!record?.id) return;
      handleCloneSurveyVersion({
        version: {
          name: createDuplicateSurveyVersionName(record.name),
          remark: '',
        },
        surveyId: record?.id,
      });
    },
    [handleCloneSurveyVersion],
  );

  const handleShowChangeLog = useCallback(() => {
    navigate(
      generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.HISTORY, {
        projectId: params.projectId,
        surveyId: params.surveyId,
      }),
    );
  }, [navigate, params.projectId, params.surveyId]);

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
        key: ACTION.COMPLETE,
        action: handleComplete,
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
    ],
    [
      handleEdit,
      handleCLone,
      handleComplete,
      handleDelete,
      handleExport,
      handleShowChangeLog,
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
            completeMutation.isLoading
          }
        >
          <ActionThreeDropDown
            record={survey.currentSurveyVersion}
            handleSelect={handleSelect}
          />
        </Spin>
      )}
    </div>
  );
};
