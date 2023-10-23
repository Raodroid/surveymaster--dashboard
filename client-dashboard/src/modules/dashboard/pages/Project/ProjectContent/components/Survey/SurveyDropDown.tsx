import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import { projectRoutePath, useGetProjectByIdQuery } from '../../../util';
import {
  CreateSurveyBodyDto,
  ISurvey,
  ProjectTypes,
} from '../../../../../../../type';
import { useCheckScopeEntityDefault } from '../../../../../../common/hoc';
import { MOMENT_FORMAT, SCOPE_CONFIG } from '../../../../../../../enums';
import { SurveyService } from '../../../../../../../services';
import { Modal, notification } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import {
  FileIconOutlined,
  PenFilled,
  RollbackOutlined,
  TrashOutlined,
} from '../../../../../../../icons';
import { ExportOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import moment from 'moment';
import { MenuDropDownWrapper } from '../../../../../../../customize-components/styles';
import ThreeDotsDropdown from '../../../../../../../customize-components/ThreeDotsDropdown';
import { onError, saveBlob } from '../../../../../../../utils';

const { confirm } = Modal;

interface IDropDownMenu {
  record: ISurvey;
}

enum ACTION_ENUM {
  DUPLICATE_SURVEY = 'DUPLICATE_SURVEY',
  RESTORE = 'RESTORE',
  EDIT = 'EDIT',
  EXPORT = 'EXPORT',
  DELETE = 'DELETE',
}

export const SurveyDropDownMenu: FC<IDropDownMenu> = props => {
  const { record } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ projectId?: string }>();
  const { project, isLoading: isFetchingProject } = useGetProjectByIdQuery(
    params?.projectId,
  );
  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const { canUpdate, canRead, canDelete } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTION,
  );

  const duplicateMutation = useMutation(
    (data: CreateSurveyBodyDto & { surveyId: string }) => {
      return SurveyService.duplicateSurvey(data as any);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        notification.success({ message: t('common.duplicateSuccess') });
      },
      onError,
    },
  );

  const deleteSurvey = useMutation(
    () => SurveyService.deleteSurveyById({ id: record.id as string }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        notification.success({
          message: t('common.deleteSuccess'),
        });
      },
      onError,
    },
  );
  const restoreSurvey = useMutation(
    () => SurveyService.restoreSurveyById({ id: record.id as string }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        notification.success({
          message: t('common.restoreSuccess'),
        });
      },
      onError,
    },
  );

  const items = useMemo(() => {
    if (isFetchingProject) return [];
    const baseMenu: ItemType[] = [];

    if (canUpdate) {
      baseMenu.push({
        icon: <PenFilled />,
        label: t('common.editSurvey'),
        key: ACTION_ENUM.EDIT,
      });
      baseMenu.push({
        icon: <FileIconOutlined />,
        label: t('common.duplicateSurvey'),
        key: ACTION_ENUM.DUPLICATE_SURVEY,
      });
      if (record.deletedAt) {
        baseMenu.push({
          icon: <RollbackOutlined />,
          label: t('common.restoreSurvey'),
          key: ACTION_ENUM.RESTORE,
        });
      }
    }

    if (!isExternalProject && canRead) {
      baseMenu.push({
        icon: <ExportOutlined />,
        label: t('common.exportQualtricsJSON'),
        key: ACTION_ENUM.EXPORT,
      });
    }
    if (canDelete && !record.deletedAt) {
      baseMenu.push({
        icon: <TrashOutlined />,
        label: t('common.deleteSurvey'),
        key: ACTION_ENUM.DELETE,
      });
    }

    return baseMenu;
  }, [
    canDelete,
    canRead,
    canUpdate,
    isExternalProject,
    isFetchingProject,
    record.deletedAt,
    t,
  ]);

  const handleExport = useCallback(async () => {
    try {
      const response = await SurveyService.getSurveyFile(
        record.latestVersion?.id as string,
      );

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
    } catch (e) {
      console.error(e);
    }
  }, [record.latestVersion?.id]);

  const handleSelect = useCallback(
    async (props: {
      record: ISurvey;
      key: string;
      keyPath: string[];
      item: React.ReactInstance;
    }) => {
      const { key, record } = props;
      switch (key) {
        case ACTION_ENUM.DUPLICATE_SURVEY: {
          await duplicateMutation.mutateAsync({
            version: {
              name: `${record?.latestVersion?.name} (Copy)`,
            },
            projectId: params.projectId as string,
            surveyId: record.id as string,
          });
          return;
        }
        case ACTION_ENUM.EDIT: {
          if (!params?.projectId) return;
          navigate(
            generatePath(projectRoutePath.DETAIL_SURVEY.EDIT, {
              projectId: params?.projectId,
              surveyId: record.id,
            }) + `?version=${record?.latestVersion?.displayId}`,
          );
          return;
        }
        case ACTION_ENUM.EXPORT: {
          await handleExport();
          return;
        }
        case ACTION_ENUM.DELETE: {
          confirm({
            icon: null,
            content: t('common.confirmDeleteSurvey'),
            onOk() {
              deleteSurvey.mutateAsync();
            },
          });
          return;
        }
        case ACTION_ENUM.RESTORE: {
          confirm({
            icon: null,
            content: t('common.confirmRestoreSurvey'),
            onOk() {
              restoreSurvey.mutateAsync();
            },
          });

          return;
        }
      }
    },
    [
      deleteSurvey,
      duplicateMutation,
      handleExport,
      navigate,
      params.projectId,
      restoreSurvey,
      t,
    ],
  );

  const menu = (
    <MenuDropDownWrapper
      onClick={input => {
        handleSelect({ ...input, record }).then();
      }}
      items={items}
    />
  );

  if (items.length === 0) return null;

  return (
    <ThreeDotsDropdown
      overlay={menu}
      placement="bottomLeft"
      trigger={'click' as any}
    />
  );
};
