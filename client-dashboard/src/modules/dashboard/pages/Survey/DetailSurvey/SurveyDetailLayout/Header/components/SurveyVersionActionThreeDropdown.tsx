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
import { DownloadIcon, LightingIcon, PenFilled, TrashOutlined } from '@/icons';
import { ExportOutlined } from '@ant-design/icons';
import { ThreeDotsDropdown } from '@/customize-components';

const ACTION = {
  COMPLETE: 'COMPLETE',
  EXPORT: 'EXPORT',
  DELETE: 'DELETE',
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
    return baseMenu;
  }, [canRead, canUpdate, isDraftVersion, isExternalProject, t]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
    />
  );
};
export { ACTION, ActionThreeDropDown };
