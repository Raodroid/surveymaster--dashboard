import { Divider, Modal, notification, Spin, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ExternalIcon, InternalIcon, PenFilled, TrashOutlined } from '@/icons';
import { Refresh } from '@/icons/Refresh';
import _get from 'lodash/get';
import moment from 'moment';
import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import {
  ActionThreeDropDownType,
  IGetParams,
  IMenuItem,
  IProject,
  ProjectQueryParam,
  ProjectTypes,
  QsParams,
} from '@/type';
import { useHandleNavigate, useParseQueryString } from '@/hooks';
import { objectKeys, onError, useToggle } from '@/utils';
import { StyledPagination } from '@/modules/dashboard';
import { ProjectTableWrapper } from '../ProjectContent/styles';
import { useCheckScopeEntityDefault } from '@hoc/index';
import { EntityEnum, ROUTE_PATH, SCOPE_CONFIG } from '@/enums';
import { ProjectService } from '@/services';
import { keysAction, useSelectTableRecord } from '@/hooks/useSelectTableRecord';
import ThreeDotsDropdown from '@/customize-components/ThreeDotsDropdown';
import { ProjectModal } from '@pages/Project';
import qs from 'qs';
import { SimpleBarCustom } from '@/customize-components';

const { confirm } = Modal;

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

const getProjects = (params: ProjectQueryParam) => {
  const newParams: ProjectQueryParam = {
    ...params,
  };
  for (const key in newParams) {
    if (!newParams[key] && typeof newParams[key] !== 'boolean') {
      delete newParams[key];
    }
  }
  return ProjectService.getProjects(newParams);
};

function ProjectTable() {
  const { t } = useTranslation();
  const qsParams = useParseQueryString<
    QsParams & { type: ProjectTypes | 'All' }
  >();
  const queryClient = useQueryClient();
  const [openProjectModal, toggleProjectModal] = useToggle();

  const [projectId, setProjectId] = useState('');

  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECT);

  const handleNavigate = useHandleNavigate(initParams);

  const formatQsParams = useMemo(() => {
    const formatQs: ProjectQueryParam = {
      q: qsParams.q || initParams.q,
      page: Number(qsParams.page) || initParams.page,
      take: Number(qsParams.take) || initParams.take,
      isDeleted: qsParams.isDeleted === 'true',
      types:
        qsParams.type === 'All'
          ? objectKeys(ProjectTypes).map(key => ProjectTypes[key])
          : [qsParams.type],
    };

    if (qsParams.createdFrom) {
      formatQs.createdFrom = moment(qsParams.createdFrom)
        ?.startOf('day')
        ?.format();
    }
    if (qsParams.createdTo) {
      formatQs.createdTo = moment(qsParams.createdTo)?.endOf('day')?.format();
    }
    return formatQs;
  }, [qsParams]);

  const {
    data: getProjectListQueryData,
    isLoading: getProjectListQueryLoading,
  } = useQuery(
    ['getProjects', formatQsParams],
    () => getProjects(formatQsParams),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: canRead,
    },
  );

  const total: number = _get(getProjectListQueryData, 'data.itemCount', 0);

  const projects = useMemo<IProject[]>(
    () => _get(getProjectListQueryData, 'data.data'),
    [getProjectListQueryData],
  );

  const { mutateAsync: deleteProjectMutate, isLoading: deleteProjectLoading } =
    useMutation(
      () =>
        ProjectService.deleteProject({
          projectId,
        }),
      {
        onSuccess: () => {
          notification.success({ message: t('common.deleteSuccess') });
          queryClient.invalidateQueries('getProjects');
          queryClient.invalidateQueries('getAllProjects');
        },
        onError,
      },
    );
  const {
    mutateAsync: restoreProjectMutate,
    isLoading: restoreProjectLoading,
  } = useMutation(
    () =>
      ProjectService.restoreProject({
        projectId,
      }),
    {
      onSuccess: () => {
        notification.success({ message: t('common.restoreSuccess') });
        queryClient.invalidateQueries('getProjects');
        queryClient.invalidateQueries('getAllProjects');
      },
      onError,
    },
  );

  const handleEdit = useCallback(() => {
    toggleProjectModal();
  }, [toggleProjectModal]);

  const handleDelete = useCallback(() => {
    confirm({
      icon: null,
      content: t('common.confirmDeleteProject'),
      onOk() {
        deleteProjectMutate();
      },
    });
  }, [deleteProjectMutate, t]);

  const handleRestore = useCallback(() => {
    confirm({
      icon: null,
      content: t('common.confirmRestoreProject'),
      onOk() {
        restoreProjectMutate();
      },
    });
  }, [restoreProjectMutate, t]);

  const tableActions = useMemo<keysAction<IProject>>(
    () => [
      {
        key: ACTION.EDIT,
        action: handleEdit,
      },
      {
        key: ACTION.DELETE,
        action: handleDelete,
      },
      {
        key: ACTION.RESTORE,
        action: handleRestore,
      },
    ],
    [handleDelete, handleEdit, handleRestore],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<IProject>(tableActions);

  const columns: ColumnsType<IProject> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'displayId',
        key: 'id',
        width: 150,
        render: (value, record) => {
          if (record.deletedAt) {
            return value;
          }
          const queryParams = qs.stringify({
            isDeleted: false,
          });
          return (
            <Link
              className={'font-semibold text-[12px]'}
              to={`${generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
                projectId: record.id,
              })}?${queryParams}`}
            >
              {value}
            </Link>
          );
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'id',
        width: 60,
        render: value =>
          value === ProjectTypes.INTERNAL ? (
            <InternalIcon className={'text-primary'} />
          ) : (
            <ExternalIcon className={'text-primary'} />
          ),
      },
      {
        title: t('common.projectTitle'),
        dataIndex: 'name',
        key: 'name',
        render: (value, record) => (
          <Tooltip
            title={`${t('common.description')}: ${record.description}`}
            placement={'right'}
            className={'cursor-pointer'}
          >
            <span className={'text-[12px]'}>{value}</span>
          </Tooltip>
        ),
      },
      {
        title: t('common.numberOfSurveys'),
        dataIndex: 'numberOfSurveys',
        key: 'numberOfSurveys',
        width: 150,
      },
      {
        title: t('common.personInCharge'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (_, record) =>
          `${record?.personResponsible?.firstName} ${record?.personResponsible?.lastName}`,
      },
      {
        title: t('common.dateOfCreation'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (text: string) => {
          const str = text.toString();
          return str.slice(0, 10);
        },
      },
      {
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        width: 60,
        render: (_, record) => (
          <div
            role="presentation"
            className="flex-center actions"
            onClick={e => {
              e.stopPropagation();
              setProjectId(record.id);
            }}
          >
            <ActionThreeDropDown record={record} handleSelect={handleSelect} />
          </div>
        ),
      },
    ],
    [t, handleSelect],
  );

  return (
    <>
      <ProjectTableWrapper>
        <Spin
          spinning={
            getProjectListQueryLoading ||
            deleteProjectLoading ||
            restoreProjectLoading
          }
        >
          <SimpleBarCustom>
            <Table
              dataSource={projects}
              columns={columns}
              pagination={false}
              rowKey={record => record.id as string}
              scroll={{ x: 800 }}
              className={'h-full'}
            />
          </SimpleBarCustom>
        </Spin>
        <Divider className={'m-0'} />
        <StyledPagination
          onChange={(page, pageSize) => {
            handleNavigate({ page, take: pageSize });
          }}
          showSizeChanger
          pageSize={formatQsParams.take}
          total={total}
          current={formatQsParams.page}
        />
      </ProjectTableWrapper>
      <ProjectModal
        mode={'edit'}
        open={openProjectModal}
        toggleOpen={toggleProjectModal}
        projectId={selectedRecord?.id}
      />
    </>
  );
}

export default ProjectTable;

const ACTION = {
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
} as const;

const ActionThreeDropDown: FC<ActionThreeDropDownType<IProject>> = props => {
  const { record, handleSelect } = props;
  const { t } = useTranslation();
  const qsParams = useParseQueryString<QsParams>();

  const { canDelete, canRestore, canUpdate } = useCheckScopeEntityDefault(
    EntityEnum.PROJECT,
  );

  const items = useMemo<IMenuItem[]>(() => {
    const baseMenu: IMenuItem[] = [];

    if (qsParams.isDeleted) return baseMenu;

    if (canUpdate) {
      baseMenu.push({
        key: ACTION.EDIT,
        icon: <PenFilled className={'text-primary'} />,
        label: <label className={''}> {t('common.editProject')}</label>,
      });
    }
    if (canDelete && !record?.deletedAt) {
      baseMenu.push({
        key: ACTION.DELETE,
        icon: <TrashOutlined className={'text-primary'} />,
        label: <label className={''}> {t('common.deleteProject')}</label>,
      });
    }
    if (canRestore && record?.deletedAt) {
      baseMenu.push({
        key: ACTION.RESTORE,
        icon: <Refresh />,
        label: <label className={''}> {t('common.restoreProject')}</label>,
      });
    }

    return baseMenu;
  }, [
    canDelete,
    canRestore,
    canUpdate,
    qsParams.isDeleted,
    record?.deletedAt,
    t,
  ]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
    />
  );
};
