import { Modal, notification, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { MOMENT_FORMAT, ROUTE_PATH, SCOPE_CONFIG } from '@/enums';
import {
  keysAction,
  useHandleNavigate,
  useParseQueryString,
  useSelectTableRecord,
} from 'hooks';
import _get from 'lodash/get';

import { RoundedTag, StyledPagination } from 'modules/dashboard';
import moment from 'moment';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath, useParams } from 'react-router';
import { SurveyService } from 'services';
import SimpleBar from 'simplebar-react';
import {
  ActionThreeDropDownType,
  DuplicateSurveyVersionDto,
  IGetParams,
  IRequestDeleteRecordDto,
  ISurvey,
  QsParams,
  SurveyVersionStatus,
} from '@/type';
import { useCheckScopeEntityDefault } from '@/modules/common';
import {
  CheckIcon,
  CloseIcon,
  DuplicateIcon,
  LightingIcon,
  PenFilled,
  RollbackOutlined,
} from '@/icons';
import { onError, useToggle } from '@/utils';
import { ThreeDotsDropdown } from '@/customize-components';
import {
  createDuplicateSurveyVersionName,
  RequestDeleteSurveyModal,
  SurveyRenameModal,
} from '@pages/Survey';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

const { confirm } = Modal;

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

function SurveyTable() {
  const params = useParams<{ projectId: string }>();
  const qsParams = useParseQueryString<QsParams>();
  const { t } = useTranslation();
  const handleNavigate = useHandleNavigate(initParams);
  const queryClient = useQueryClient();
  const [openRenameModal, toggleOpenRenameModal] = useToggle();
  const [openApproveDeleteSurveyModal, toggleOpenApproveDeleteSurveyModal] =
    useToggle();

  const formatQsParams = useMemo(() => {
    const formatQs: IGetParams = {
      q: qsParams.q || initParams.q,
      page: Number(qsParams.page) || initParams.page,
      take: Number(qsParams.take) || initParams.take,
      isDeleted: qsParams.isDeleted === 'true',
      createdFrom: moment(qsParams.createdFrom)?.startOf('day')?.format(),
      createdTo: moment(qsParams.createdTo)?.endOf('day')?.format(),
    };
    if (!qsParams.createdFrom) delete formatQs.createdFrom;
    if (!qsParams.createdTo) delete formatQs.createdTo;
    return formatQs;
  }, [qsParams]);

  const {
    mutateAsync: requestDeleteSurveyMutate,
    isLoading: requestDeleteSurveyLoading,
  } = useMutation(
    (data: IRequestDeleteRecordDto) => {
      return SurveyService.requestDeleteSurvey({
        ...data,
      });
    },
    {
      onSuccess: async () => {
        notification.success({ message: t('common.denySuccess') });
        await queryClient.invalidateQueries('getSurveys');
      },
      onError,
    },
  );

  const { mutateAsync: duplicateMutate, isLoading: duplicateLoading } =
    useMutation(
      (data: DuplicateSurveyVersionDto) => {
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

  const { mutateAsync: deleteSurveyMutate, isLoading: deleteSurveyLoading } =
    useMutation(
      (record: ISurvey) =>
        SurveyService.deleteSurveyById({ id: record.id as string }),
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
  const { mutateAsync: restoreSurveyMutate, isLoading: restoreSurveyLoading } =
    useMutation(
      (record: ISurvey) =>
        SurveyService.restoreSurveyById({ id: record.id as string }),
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

  const handleDuplicateSurvey = useCallback(
    (record: ISurvey) => {
      duplicateMutate({
        version: {
          name: createDuplicateSurveyVersionName(record?.latestVersion?.name),
          remarks: [],
        },
        surveyId: record.id as string,
      });
    },
    [duplicateMutate],
  );

  const handleRestore = useCallback(
    (record: ISurvey) => {
      confirm({
        icon: null,
        content: t('common.confirmRestoreSurvey'),
        onOk() {
          restoreSurveyMutate(record);
        },
      });
    },
    [restoreSurveyMutate, t],
  );

  const handleResponseDeleteRequest = useCallback(
    (type: 'accept' | 'deny', record: ISurvey) => {
      if (type === 'accept') {
        confirm({
          icon: null,
          content: t('common.confirmDeleteSurvey'),
          onOk() {
            deleteSurveyMutate(record);
          },
        });

        return;
      }

      confirm({
        icon: null,
        content: t('common.confirmDenyDeleteRequestSurvey'),
        onOk() {
          requestDeleteSurveyMutate({
            isAwaitingDeletion: false,
            id: record?.id as string,
          });
        },
      });
    },
    [deleteSurveyMutate, requestDeleteSurveyMutate, t],
  );

  const tableActions = useMemo<keysAction<ISurvey>>(
    () => [
      {
        key: ACTION.RENAME,
        action: toggleOpenRenameModal,
      },
      {
        key: ACTION.DUPLICATE_SURVEY,
        action: handleDuplicateSurvey,
      },
      {
        key: ACTION.REQUEST_DELETE,
        action: toggleOpenApproveDeleteSurveyModal,
      },
      {
        key: ACTION.RESTORE,
        action: handleRestore,
      },
      {
        key: ACTION.ACCEPT_REQUEST_DELETE,
        action: record => {
          handleResponseDeleteRequest('accept', record);
        },
      },
      {
        key: ACTION.DENY_REQUEST_DELETE,
        action: record => {
          handleResponseDeleteRequest('deny', record);
        },
      },
    ],
    [
      toggleOpenRenameModal,
      handleDuplicateSurvey,
      toggleOpenApproveDeleteSurveyModal,
      handleRestore,
      handleResponseDeleteRequest,
    ],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<ISurvey>(tableActions);

  const { isLoading: getSurveyListQueryLoading, data: getSurveyListQueryData } =
    useQuery(
      ['getSurveys', formatQsParams, params],
      () =>
        SurveyService.getSurveys({
          ...formatQsParams,
          projectId: params.projectId,
        }),
      {
        refetchOnWindowFocus: false,
      },
    );

  const total: number = _get(getSurveyListQueryData, 'data.itemCount', 0);

  const surveys = useMemo<ISurvey[]>(
    () => _get(getSurveyListQueryData, 'data.data'),
    [getSurveyListQueryData],
  );

  const columns: ColumnsType<ISurvey> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'displayId',
        key: 'displayId',
        width: 150,
        render: (value, record) => {
          if (record.deletedAt) {
            return value;
          }
          return (
            <Link
              className={'font-semibold text-[12px]'}
              to={
                generatePath(
                  ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
                  {
                    projectId: params?.projectId,
                    surveyId: record.id,
                  },
                ) + `?version=${record.latestVersion?.displayId}`
              }
            >
              {value}
            </Link>
          );
        },
      },
      {
        title: t('common.surveyTitle'),
        dataIndex: ['latestVersion', 'name'],
        key: 'name',
      },
      {
        title: t('common.creationDate'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (text: Date) => {
          return text
            ? moment(text).format(MOMENT_FORMAT.FULL_DATE_FORMAT)
            : '--';
        },
      },
      {
        title: t('common.status'),
        dataIndex: ['latestVersion', 'status'],
        key: 'status',
        render: (value: SurveyVersionStatus, record) => {
          const versionCount = (record.versions?.length || 0) - 1;
          return (
            <div className={'flex gap-3'}>
              <RoundedTag
                title={t(`status.${value}`)}
                color={
                  value === SurveyVersionStatus.DRAFT ? '#232567' : '#00AB00'
                }
              />
              {versionCount > 0 && (
                <RoundedTag
                  title={t('common.countMore', { count: versionCount })}
                  color={'#232567'}
                />
              )}
            </div>
          );
        },
      },
      {
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        width: 100,
        render: (_, record: ISurvey) => (
          <div
            role="presentation"
            className="flex-center actions"
            onClick={e => e.stopPropagation()}
          >
            <ActionThreeDropDown record={record} handleSelect={handleSelect} />
          </div>
        ),
      },
    ],
    [handleSelect, params?.projectId, t],
  );

  return (
    <>
      <div className="h-full w-full p-2 relative overflow-hidden">
        <SimpleBar className={'h-full overflow-scroll'}>
          <Spin
            spinning={
              getSurveyListQueryLoading ||
              requestDeleteSurveyLoading ||
              deleteSurveyLoading ||
              duplicateLoading ||
              restoreSurveyLoading
            }
          >
            <Table
              rowClassName={'pointer'}
              dataSource={surveys}
              columns={columns}
              pagination={false}
              rowKey={record => record.id as string}
              scroll={{ x: 800 }}
              className={'p-3'}
            />
          </Spin>
        </SimpleBar>
      </div>
      <StyledPagination
        onChange={(page, pageSize) => {
          handleNavigate({ page, take: pageSize });
        }}
        showSizeChanger
        pageSize={formatQsParams.take}
        total={total}
        current={formatQsParams.page}
      />
      <SurveyRenameModal
        open={openRenameModal}
        toggleOpen={toggleOpenRenameModal}
        surveyId={selectedRecord?.id}
      />
      <RequestDeleteSurveyModal
        open={openApproveDeleteSurveyModal}
        toggleOpen={toggleOpenApproveDeleteSurveyModal}
        versionId={selectedRecord?.id}
      />
    </>
  );
}

export default SurveyTable;

const ACTION = {
  RENAME: 'RENAME',
  DUPLICATE_SURVEY: 'DUPLICATE_SURVEY',
  RESTORE: 'RESTORE',
  REQUEST_DELETE: 'REQUEST_DELETE',
  DENY_REQUEST_DELETE: 'DENY_REQUEST_DELETE',
  ACCEPT_REQUEST_DELETE: 'ACCEPT_REQUEST_DELETE',
} as const;

const ActionThreeDropDown: FC<ActionThreeDropDownType<ISurvey>> = props => {
  const { record, handleSelect } = props;
  const { t } = useTranslation();

  const profile = useSelector(AuthSelectors.getProfile);

  const { canDelete, canRestore, canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTION,
  );

  const items = useMemo<ItemType[]>(() => {
    const baseMenu: ItemType[] = [];
    if (canUpdate) {
      baseMenu.push({
        icon: <PenFilled className={'text-primary'} />,
        label: <label>{t('common.rename')}</label>,
        key: ACTION.RENAME,
      });
      baseMenu.push({
        icon: <DuplicateIcon className={'text-primary'} />,
        label: <label>{t('common.duplicateSurvey')}</label>,
        key: ACTION.DUPLICATE_SURVEY,
      });
      if (record.deletedAt && canRestore) {
        baseMenu.push({
          icon: <RollbackOutlined className={'text-primary'} />,
          label: t('common.restoreSurvey'),
          key: ACTION.RESTORE,
        });
      }
    }
    if (canDelete && !record.isAwaitingDeletion && !record.deletedAt) {
      baseMenu.push({
        icon: <LightingIcon className={'text-primary'} />,
        label: t('common.requestDeleteSurvey'),
        key: ACTION.REQUEST_DELETE,
      });
    }
    if (canDelete && !record.deletedAt && record.isAwaitingDeletion) {
      if (record.deletedBy === profile?.id) {
        baseMenu.push({
          icon: <CheckIcon className={'text-primary'} />,
          label: t('common.acceptDeleteRequest'),
          key: ACTION.ACCEPT_REQUEST_DELETE,
        });
      }
      if (
        record.deletedBy === profile?.id ||
        profile?.id === record?.createdBy
      ) {
        baseMenu.push({
          icon: <CloseIcon className={'text-primary'} />,
          label: t('common.denyDeleteRequest'),
          key: ACTION.DENY_REQUEST_DELETE,
        });
      }
    }
    return baseMenu;
  }, [
    canDelete,
    canRestore,
    canUpdate,
    profile?.id,
    record?.createdBy,
    record.deletedAt,
    record.deletedBy,
    record.isAwaitingDeletion,
    t,
  ]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
    />
  );
};
