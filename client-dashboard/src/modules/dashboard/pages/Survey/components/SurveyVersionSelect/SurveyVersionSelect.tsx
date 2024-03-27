import { FC, useCallback, useMemo } from 'react';
import { RoundedSelect, ThreeDotsDropdown } from '@/customize-components';
import { SelectProps } from 'antd/lib/select';
import { generatePath, useNavigate, useParams } from 'react-router';
import qs from 'qs';
import { keysAction, useParseQueryString, useSelectTableRecord } from '@/hooks';
import {
  ActionThreeDropDownType,
  IGetParams,
  IMenuItem,
  ISurveyVersion,
  ProjectTypes,
  SubSurveyFlowElementDto,
  SurveyVersionStatus,
} from '@/type';
import {
  createDuplicateSurveyVersionName,
  handleExportSurvey,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import { useFormikContext } from 'formik';
import { Modal, notification } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { useCheckScopeEntityDefault } from '@/modules/common';
import { ROUTE_PATH, SCOPE_CONFIG } from '@/enums';
import {
  DownloadIcon,
  LightingIcon,
  NewVersionIcon,
  PenFilled,
  TrashOutlined,
} from '@/icons';
import { useGetProjectByIdQuery } from '@pages/Project';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError, useToggle } from '@/utils';
import { projectSurveyParams } from '@pages/Survey/DetailSurvey/DetailSurvey';
import { transSurveyFLowElement } from '@pages/Survey/components/SurveyFormContext/util';
import styled from 'styled-components/macro';

const { confirm } = Modal;

const SurveyVersionSelect: FC<{
  versions?: ISurveyVersion[];
  value: SelectProps['value'];
}> = props => {
  const params = useParams<projectSurveyParams>();
  const { versions = [], value } = props;
  const qsParams = useParseQueryString<IGetParams & { version?: string }>();
  const navigate = useNavigate();
  const { isEditMode } = useCheckSurveyFormMode();
  const { handleCloneSurveyVersion } = useSurveyFormContext();
  const { dirty } = useFormikContext(); //only use the component inside formik component
  const [isExporting, toggleExporting] = useToggle();

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const completeMutation = useMutation(
    (data: { surveyVersionId: string }) => {
      return SurveyService.updateStatusSurvey(data);
    },
    {
      onSuccess: async res => {
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.updateSuccess') });

        navigate(
          `${generatePath(
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
            {
              projectId: params.projectId,
              surveyId: params.surveyId,
            },
          )}?version=${res.data.displayId}`,
        );
      },
      onError,
    },
  );

  const deleteMutation = useMutation(
    (data: { id: string }) => {
      return SurveyService.deleteSurveyVersion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.deleteSuccess') });
      },
      onError,
    },
  );

  const handleDirect = useCallback(
    options => {
      const newQes = qs.stringify({
        ...qsParams,
        version: options.value,
      });
      navigate(`${window.location.pathname}?${newQes}`);
    },
    [navigate, qsParams],
  );

  const changeVersion = useCallback(
    (version, options) => {
      if (isEditMode && dirty) {
        confirm({
          icon: null,
          content: (
            <Trans
              i18nKey="direction.warningLostData" // optional -> fallbacks to defaults if not provided
            />
          ),
          onOk() {
            handleDirect(options);
          },
        });
        return;
      }
      handleDirect(options);
    },
    [dirty, handleDirect, isEditMode],
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

  const handleEdit = useCallback(() => {
    navigate(
      `${generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT, {
        projectId: params.projectId,
        surveyId: params.surveyId,
      })}?version=${qsParams.version}`,
    );
  }, [navigate, params.projectId, params.surveyId, qsParams.version]);

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
        key: ACTION.MARK_AS_COMPLETE,
        action: handleComplete,
      },
      {
        key: ACTION.DUPLICATE_AND_START_NEW_VERSION,
        action: handleCLone,
      },
      {
        key: ACTION.EDIT_VERSION,
        action: handleEdit,
      },
    ],
    [handleCLone, handleComplete, handleDelete, handleEdit, handleExport],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<ISurveyVersion>(tableActions);

  const options: SelectProps['options'] = (versions || [])?.map(ver => {
    const color =
      ver.status === SurveyVersionStatus.COMPLETED ? '#00AB00' : '#007AE7';
    return {
      label: (
        <div className={'flex gap-3 it items-center'}>
          <span
            className={'w-[8px] h-[8px] rounded-full'}
            style={{ background: color }}
          />
          <span className={'text-[12px] flex-1'}> {ver.displayId}</span>
          {ver.displayId !== value && (
            <ActionThreeDropDown record={ver} handleSelect={handleSelect} />
          )}
        </div>
      ),
      value: ver?.displayId || '',
    };
  });

  return (
    <Wrapper
      value={value}
      options={options}
      className={'w-[250px]'}
      onChange={changeVersion}
      loading={
        isExporting || deleteMutation.isLoading || completeMutation.isLoading
      }
    />
  );
};

export default SurveyVersionSelect;

const ACTION = {
  MARK_AS_COMPLETE: 'MARK_AS_COMPLETE',
  EDIT_VERSION: 'EDIT_VERSION',
  DUPLICATE_AND_START_NEW_VERSION: 'DUPLICATE_AND_START_NEW_VERSION',
  DELETE: 'DELETE',
  EXPORT: 'EXPORT',
} as const;

const ActionThreeDropDown: FC<
  ActionThreeDropDownType<ISurveyVersion>
> = props => {
  const { record, handleSelect } = props;
  const { t } = useTranslation();
  const params = useParams<{ surveyId?: string; projectId?: string }>();

  const { project } = useGetProjectByIdQuery(params?.projectId);

  const isDraftVersion = record?.status === SurveyVersionStatus.DRAFT;

  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const { canUpdate, canRead, canDelete } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEY,
  );

  const items = useMemo(() => {
    const baseMenu: IMenuItem[] = [];

    if (canUpdate && isDraftVersion) {
      baseMenu.push({
        icon: <PenFilled className={'text-primary'} />,
        label: t('common.editVersion'),
        key: ACTION.EDIT_VERSION,
      });
    }
    if (canUpdate) {
      baseMenu.push({
        icon: <NewVersionIcon className={'text-primary'} />,
        label: t('common.duplicateAndStartNewVersion'),
        key: ACTION.DUPLICATE_AND_START_NEW_VERSION,
      });
    }

    if (canUpdate && isDraftVersion) {
      baseMenu.push({
        icon: <LightingIcon className={'text-primary'} />,
        label: t('direction.markAsCompleted'),
        key: ACTION.MARK_AS_COMPLETE,
      });
    }

    if (canDelete) {
      baseMenu.push({
        icon: <TrashOutlined className={'text-primary'} />,
        label:
          record.status === SurveyVersionStatus.COMPLETED
            ? t('common.deleteVersion')
            : t('common.deleteDraft'),
        key: ACTION.DELETE,
      });
    }
    if (canRead && !isDraftVersion && !isExternalProject) {
      baseMenu.push({
        icon: <DownloadIcon className={'text-primary'} />,
        label: t('common.exportQualtricsJSON'),
        key: ACTION.EXPORT,
      });
    }
    return baseMenu;
  }, [
    canDelete,
    canRead,
    canUpdate,
    isDraftVersion,
    isExternalProject,
    t,
    record.status,
  ]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
      size={'small'}
    />
  );
};

const Wrapper = styled(RoundedSelect)`
  .ant-select-selection-item {
    .ant-dropdown-trigger {
      display: none;
    }
  }
  .ant-select-item {
    height: 40px;
  }
`;
