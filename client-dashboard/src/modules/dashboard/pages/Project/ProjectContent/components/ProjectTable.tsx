import { Modal, notification, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ExternalIcon, InternalIcon, PenFilled, TrashOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import _get from 'lodash/get';
import moment from 'moment';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom';
import {
  ActionThreeDropDownType,
  GetListQuestionDto,
  IGetParams,
  IMenuItem,
  IProject,
  ProjectTypes,
  QsParams,
} from 'type';
import { useHandleNavigate, useParseQueryString } from '@/hooks';
import { onError } from '@/utils';
import { HannahCustomSpin, StyledPagination } from '@/modules/dashboard';
import { ProjectTableWrapper } from '../styles';
import SimpleBar from 'simplebar-react';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { EntityEnum, ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import { ProjectService } from '@/services';
import { keysAction, useSelectTableRecord } from '@/hooks/useSelectTableRecord';
import ThreeDotsDropdown from '@/customize-components/ThreeDotsDropdown';

const { confirm } = Modal;

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

const getProjects = (params: GetListQuestionDto) => {
  const newParams: GetListQuestionDto = {
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
  const wrapperRef = useRef<any>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const qsParams = useParseQueryString<QsParams>();
  const queryClient = useQueryClient();

  const [projectId, setProjectId] = useState('');

  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECT);

  const handleNavigate = useHandleNavigate(initParams);

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

  const getProjectListQuery = useQuery(
    ['getProjects', formatQsParams],
    () => getProjects(formatQsParams),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: canRead,
    },
  );

  const total: number = _get(getProjectListQuery.data, 'data.itemCount', 0);

  const projects = useMemo<IProject[]>(
    () => _get(getProjectListQuery.data, 'data.data'),
    [getProjectListQuery.data],
  );

  const mutationDeleteProject = useMutation(
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
  const mutationRestoreProject = useMutation(
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

  const handleEdit = useCallback(
    (record: IProject) =>
      navigate(
        generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.EDIT, {
          projectId: record?.id,
        }),
      ),
    [navigate],
  );

  const handleDelete = useCallback(() => {
    confirm({
      icon: null,
      content: t('common.confirmDeleteProject'),
      onOk() {
        mutationDeleteProject.mutateAsync();
      },
    });
  }, [mutationDeleteProject, t]);

  const handleRestore = useCallback(() => {
    confirm({
      icon: null,
      content: t('common.confirmRestoreProject'),
      onOk() {
        mutationRestoreProject.mutateAsync();
      },
    });
  }, [mutationRestoreProject, t]);

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
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'id',
        render: value =>
          value === ProjectTypes.INTERNAL ? (
            <InternalIcon className={'text-primary'} />
          ) : (
            <ExternalIcon />
          ),
      },
      {
        title: t('common.projectTitle'),
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => (
          <Tooltip
            title={record.description}
            placement={'right'}
            color={'pink'}
          >
            {_}
          </Tooltip>
        ),
      },
      {
        title: t('common.numberOfSurveys'),
        dataIndex: 'numberOfSurveys',
        key: 'numberOfSurveys',
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
        render: (text: string) => {
          const str = text.toString();
          return <div>{str.slice(0, 10)}</div>;
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

  const onRow = useCallback(
    (record: IProject) => {
      return {
        onClick: () =>
          !qsParams?.isDeleted &&
          navigate(
            generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
              projectId: record.id,
            }),
          ),
      };
    },
    [navigate, qsParams?.isDeleted],
  );

  return (
    <>
      <ProjectTableWrapper ref={wrapperRef} centerLastChild>
        <HannahCustomSpin
          parentRef={wrapperRef}
          spinning={
            getProjectListQuery.isLoading || getProjectListQuery.isFetching
          }
        />
        <SimpleBar className={'ProjectTableWrapper__body'}>
          <Table
            dataSource={projects}
            columns={columns}
            onRow={onRow}
            pagination={false}
            rowKey={record => record.id as string}
            scroll={{ x: 800 }}
          />
        </SimpleBar>
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
    if (canDelete) {
      baseMenu.push({
        key: ACTION.DELETE,
        icon: <TrashOutlined className={'text-primary'} />,
        label: <label className={''}> {t('common.deleteProject')}</label>,
      });
    }
    if (canRestore) {
      baseMenu.push({
        key: ACTION.DELETE,
        icon: <Refresh />,
        label: <label className={''}> {t('common.restoreProject')}</label>,
      });
    }

    return baseMenu;
  }, [canDelete, canRestore, canUpdate, qsParams?.isDeleted, t]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
    />
  );
};
