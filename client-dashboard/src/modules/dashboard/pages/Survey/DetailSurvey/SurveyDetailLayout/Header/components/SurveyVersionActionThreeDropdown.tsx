import React, { FC, useMemo } from 'react';
import {
  ActionThreeDropDownType,
  IMenuItem,
  ISurveyVersion,
  ProjectTypes,
  SurveyVersionStatus,
} from '@/type';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGetProjectByIdQuery } from '@pages/Project';
import { useCheckScopeEntityDefault } from '@/modules/common';
import { SCOPE_CONFIG } from '@/enums';
import {
  Clock,
  DownloadIcon,
  DuplicateIcon,
  LightingIcon,
  PenFilled,
  TrashOutlined,
} from '@/icons';
import { ThreeDotsDropdown } from '@/customize-components';

const ACTION = {
  EDIT: 'EDIT',
  COMPLETE: 'COMPLETE',
  RENAME: 'RENAME',
  EXPORT: 'EXPORT',
  DELETE: 'DELETE',
  CLONE: 'CLONE',
  SHOW_CHANGE_LOG: 'SHOW_CHANGE_LOG',
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

  const { canUpdate, canRead } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEY,
  );

  const items = useMemo(() => {
    const baseMenu: IMenuItem[] = [];

    if (canUpdate && isDraftVersion) {
      baseMenu.push({
        icon: <PenFilled className={'text-primary'} />,
        label: t('common.editSurvey'),
        key: ACTION.EDIT,
      });
    }
    baseMenu.push({
      icon: <DuplicateIcon className={'text-primary'} />,
      label: t('common.duplicateSurvey'),
      key: ACTION.CLONE,
    });
    if (canUpdate) {
      baseMenu.push({
        icon: <PenFilled className={'text-primary'} />,
        label: t('common.rename'),
        key: ACTION.RENAME,
      });
    }
    if (canUpdate && isDraftVersion) {
      baseMenu.push({
        icon: <LightingIcon className={'text-primary'} />,
        label: t('direction.markAsCompleted'),
        key: ACTION.COMPLETE,
      });
    }

    if (canRead) {
      if (!isDraftVersion && !isExternalProject) {
        baseMenu.push({
          icon: <DownloadIcon className={'text-primary'} />,
          label: t('common.exportQualtricsJSON'),
          key: ACTION.EXPORT,
        });
      }

      baseMenu.push({
        icon: <TrashOutlined className={'text-primary'} />,
        label: t('common.delete'),
        key: ACTION.DELETE,
      });
    }
    baseMenu.push({
      icon: <Clock className={'text-primary'} />,
      label: t('common.showChangeLog'),
      key: ACTION.SHOW_CHANGE_LOG,
    });
    return baseMenu;
  }, [canRead, canUpdate, isDraftVersion, isExternalProject, t]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
      title={
        <div className={'font-semibold text-[14px]'}>{t('common.actions')}</div>
      }
    />
  );
};
export { ACTION, ActionThreeDropDown };
