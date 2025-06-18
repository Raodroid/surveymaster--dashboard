import { FC, useMemo } from 'react';
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
  CheckIcon,
  Clock,
  CloseIcon,
  DownloadIcon,
  DuplicateIcon,
  LightingIcon,
  PenFilled,
  TrashOutlined,
} from '@/icons';
import { ThreeDotsDropdown } from '@/customize-components';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

const ACTION = {
  EDIT: 'EDIT',
  APPROVE_COMPLETE_REQUEST: 'APPROVE_COMPLETE_REQUEST',
  DENY_COMPLETE_REQUEST: 'DENY_COMPLETE_REQUEST',
  RENAME: 'RENAME',
  EXPORT: 'EXPORT',
  DELETE: 'DELETE',
  CLONE: 'CLONE',
  SHOW_CHANGE_LOG: 'SHOW_CHANGE_LOG',
  REQUEST_COMPLETE: 'REQUEST_COMPLETE',
  REQUEST_DELETE: 'REQUEST_DELETE',
  APPROVE_DELETE_REQUEST: 'APPROVE_DELETE_REQUEST',
  DENY_DELETE_REQUEST: 'DENY_DELETE_REQUEST',
} as const;

const ActionThreeDropDown: FC<
  ActionThreeDropDownType<ISurveyVersion> & { versionCount: number }
> = props => {
  const { record, handleSelect, versionCount } = props;
  const { t } = useTranslation();
  const params = useParams<{ surveyId?: string; projectId?: string }>();
  const profile = useSelector(AuthSelectors.getProfile);

  const { project } = useGetProjectByIdQuery(params?.projectId);

  const isDraftVersion = record?.status === SurveyVersionStatus.DRAFT;
  const isCompletedVersion = record?.status === SurveyVersionStatus.COMPLETED;

  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const { canUpdate, canRead, canDelete } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEY,
  );

  const items = useMemo(() => {
    const baseMenu: ItemType[] = [];

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
    if (
      canUpdate &&
      isDraftVersion &&
      record.surveyFlowElements?.length !== 0
    ) {
      baseMenu.push({
        icon: <LightingIcon className={'text-primary'} />,
        label: t('direction.requestCompletedVersion'),
        key: ACTION.REQUEST_COMPLETE,
      });
    }
    if (
      canUpdate &&
      record.status === SurveyVersionStatus.AWAIT_APPROVAL &&
      profile?.id === record?.approvalUserId
    ) {
      baseMenu.push({
        icon: <CheckIcon className={'text-primary'} />,
        label: t('common.approveRequest'),
        key: ACTION.APPROVE_COMPLETE_REQUEST,
      });
    }
    if (
      canUpdate &&
      record.status === SurveyVersionStatus.AWAIT_APPROVAL &&
      (profile?.id === record?.createdBy ||
        profile?.id === record?.approvalUserId)
    ) {
      baseMenu.push({
        icon: <CloseIcon className={'text-primary'} />,
        label: t('common.denyRequest'),
        key: ACTION.DENY_COMPLETE_REQUEST,
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
    }
    if (versionCount > 1 && canDelete && !isCompletedVersion) {
      baseMenu.push({
        icon: <TrashOutlined className={'text-primary'} />,
        label: t('common.delete'),
        key: ACTION.DELETE,
      });
    }

    if (
      versionCount > 1 &&
      canUpdate &&
      isCompletedVersion &&
      !record.isAwaitingDeletion
    ) {
      baseMenu.push({
        icon: <LightingIcon className={'text-primary'} />,
        label: t('common.requestDeleteVersion'),
        key: ACTION.REQUEST_DELETE,
      });
    }
    if (
      canUpdate &&
      record.isAwaitingDeletion &&
      profile?.id === record?.deletedBy
    ) {
      baseMenu.push({
        icon: <CheckIcon className={'text-primary'} />,
        label: t('common.approveDeleteRequest'),
        key: ACTION.APPROVE_DELETE_REQUEST,
      });
    }
    if (
      canUpdate &&
      record.isAwaitingDeletion &&
      (profile?.id === record?.createdBy ||
        profile?.id === record?.approvalUserId)
    ) {
      baseMenu.push({
        icon: <CloseIcon className={'text-primary'} />,
        label: t('common.denyDeleteRequest'),
        key: ACTION.DENY_DELETE_REQUEST,
      });
    }

    baseMenu.push({
      type: 'divider',
    });
    baseMenu.push({
      icon: <Clock className={'text-primary'} />,
      label: t('common.showChangeLog'),
      key: ACTION.SHOW_CHANGE_LOG,
    });
    return baseMenu;
  }, [
    canUpdate,
    isDraftVersion,
    t,
    record.surveyFlowElements?.length,
    record.status,
    record?.approvalUserId,
    record?.createdBy,
    record.isAwaitingDeletion,
    record?.deletedBy,
    profile?.id,
    canRead,
    canDelete,
    isCompletedVersion,
    versionCount,
    isExternalProject,
  ]);

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
