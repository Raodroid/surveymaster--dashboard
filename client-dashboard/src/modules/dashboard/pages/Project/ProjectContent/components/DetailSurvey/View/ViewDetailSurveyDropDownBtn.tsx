import { Button, Dropdown, Modal, notification } from 'antd';
import {
  IPutSurveyVersionBodyDtoExtendId,
  ISurveyQuestion,
  ISurveyVersion,
  ProjectTypes,
  SurveyVersionStatus,
} from '../../../../../../../../type';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import useParseQueryString from '../../../../../../../../hooks/useParseQueryString';
import { useGetProjectByIdQuery } from '../../../../util';
import { useCheckScopeEntityDefault } from '../../../../../../../common/hoc';
import {
  MOMENT_FORMAT,
  ROUTE_PATH,
  SCOPE_CONFIG,
} from '../../../../../../../../enums';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import {
  PenFilled,
  ThreeDotsIcon,
  TrashOutlined,
} from '../../../../../../../../icons';
import { ExportOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { SurveyService } from '../../../../../../../../services';
import _get from 'lodash/get';
import moment from 'moment';
import { MenuDropDownWrapper } from '../../../../../../../../customize-components/styles';
import { onError, saveBlob } from '../../../../../../../../utils';

const { confirm } = Modal;

interface IDropDownMenuButton {
  surveyVersion: ISurveyVersion;
  callbackLoading: () => void;
}

enum ACTION_ENUM {
  COMPLETE = 'COMPLETE',
  EXPORT = 'EXPORT',
  DELETE = 'DELETE',
}

export const ViewDetailSurveyDropDownMenuButton: FC<
  IDropDownMenuButton
> = props => {
  const { surveyVersion, callbackLoading } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ surveyId?: string; projectId?: string }>();
  const qsParams = useParseQueryString<{ version?: string }>();

  const { project } = useGetProjectByIdQuery(params?.projectId);

  const isSelected = qsParams.version === surveyVersion.displayId;

  const isDraftVersion = surveyVersion?.status === SurveyVersionStatus.DRAFT;

  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const { canUpdate, canRead } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEYS,
  );

  const items = useMemo(() => {
    const baseMenu: ItemType[] = [];

    if (canUpdate && isDraftVersion) {
      baseMenu.push({
        icon: <PenFilled />,
        label: t('direction.markAsCompleted'),
        key: ACTION_ENUM.COMPLETE,
      });
    }
    if (canRead) {
      if (!isDraftVersion && !isExternalProject) {
        baseMenu.push({
          icon: <ExportOutlined />,
          label: t('common.exportQualtricsJSON'),
          key: ACTION_ENUM.EXPORT,
        });
      }

      baseMenu.push({
        icon: <TrashOutlined />,
        label: t('common.delete'),
        key: ACTION_ENUM.DELETE,
      });
    }
    return baseMenu;
  }, [canRead, canUpdate, isDraftVersion, isExternalProject, t]);

  const location = useLocation();

  const deleteMutation = useMutation(
    (data: { id: string }) => {
      callbackLoading();
      return SurveyService.deleteSurveyVersion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        await queryClient.invalidateQueries('getSurveyById');
        callbackLoading();
        notification.success({ message: t('common.deleteSuccess') });
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
            projectId: params.projectId,
          }),
        );
      },
      onError: e => {
        callbackLoading();
        onError(e);
      },
    },
  );
  const completeMutation = useMutation(
    (data: IPutSurveyVersionBodyDtoExtendId) => {
      callbackLoading();
      return SurveyService.updateSurvey(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        await queryClient.invalidateQueries('getSurveyById');
        callbackLoading();
        notification.success({ message: t('common.updateSuccess') });
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
            projectId: params.projectId,
          }),
        );
      },
      onError: e => {
        callbackLoading();
        onError(e);
      },
    },
  );

  const handleSelect = useCallback(
    async (props: {
      record: ISurveyVersion;
      key: string;
      keyPath: string[];
      item: React.ReactInstance;
    }) => {
      const { key, record } = props;

      switch (key) {
        case ACTION_ENUM.DELETE: {
          confirm({
            icon: null,
            content: t('common.confirmDeleteSurveyVersion'),
            onOk() {
              deleteMutation.mutateAsync({ id: record.id as string });
            },
          });

          break;
        }
        case ACTION_ENUM.EXPORT: {
          try {
            callbackLoading();
            const response = await SurveyService.getSurveyFile(
              record.id as string,
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
          } catch (error) {
            console.error({ error });
          } finally {
            callbackLoading();
          }
          break;
        }
        case ACTION_ENUM.COMPLETE: {
          confirm({
            icon: null,
            content: t('common.confirmCompleteSurveyVersion'),
            onOk() {
              completeMutation.mutateAsync({
                surveyVersionId: record.id as string,
                name: record.name,
                questions: record.questions as ISurveyQuestion[],
                status: SurveyVersionStatus.COMPLETED,
                remark: record.remark || '',
              });
            },
          });
          break;
        }
      }
    },
    [callbackLoading, completeMutation, deleteMutation, t],
  );

  const menu = (
    <MenuDropDownWrapper
      onClick={input => {
        handleSelect({ ...input, record: surveyVersion }).then();
      }}
      items={items}
    />
  );
  const changeViewVersion = useCallback(() => {
    navigate(
      generatePath(location.pathname, {
        surveyId: params.surveyId,
        projectId: params.projectId,
      }) + `?version=${surveyVersion.displayId}`,
    );
  }, [
    location.pathname,
    navigate,
    params.projectId,
    params.surveyId,
    surveyVersion.displayId,
  ]);

  return (
    <Dropdown.Button
      overlay={menu}
      placement="bottomLeft"
      trigger={'click' as any}
      className={'active'}
      size={'small'}
      buttonsRender={() => [
        <Button
          className={'info-btn'}
          type={isSelected ? 'primary' : 'default'}
          onClick={changeViewVersion}
        >
          {surveyVersion.displayId}
        </Button>,
        <Button className={'info-btn'}>
          <ThreeDotsIcon style={{ width: 12, height: 12 }} />
        </Button>,
      ]}
    />
  );
};
