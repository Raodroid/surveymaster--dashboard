import { Button, Menu, Modal, notification, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { PenFilled, TrashOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import _get from 'lodash/get';
import moment from 'moment';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import { GetListQuestionDto, IGetParams, IProject } from 'type';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import { onError } from '../../../../../../utils';
import StyledPagination from '../../../../components/StyledPagination';
import { projectRoutePath } from '../../util';
import { ProjectTableWrapper } from '../styles';
import { QsParams } from './ProjectFilter';
import SimpleBar from 'simplebar-react';
import { MenuDropDownWrapper } from '../../../../../../customize-components/styles';
import HannahCustomSpin from '../../../../components/HannahCustomSpin';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { SCOPE_CONFIG } from 'enums';
import useHandleNavigate from 'hooks/useHandleNavigate';

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

  const { canRead, canRestore, canDelete, canUpdate } =
    useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECTS);

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
    canRead ? () => getProjects(formatQsParams) : () => {},
    {
      onError,
      refetchOnWindowFocus: false,
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

  const columns: ColumnsType<IProject> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'displayId',
        key: 'id',
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
        render: (_, record) => (
          <div>
            {`${record?.personResponsible?.firstName} ${record?.personResponsible?.lastName}`}
          </div>
        ),
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
        width: 100,
        render: (_, record) => (
          <div
            className="flex-center actions"
            onClick={e => {
              e.stopPropagation();
              setProjectId(record.id);
            }}
          >
            <ThreeDotsDropdown
              overlay={
                <MenuDropDownWrapper>
                  {qsParams?.isDeleted !== 'true' && canUpdate && (
                    <Menu.Item
                      onClick={() =>
                        navigate(
                          generatePath(projectRoutePath.PROJECT.EDIT, {
                            projectId: record?.id,
                          }),
                        )
                      }
                    >
                      <PenFilled /> {t('common.editProject')}
                    </Menu.Item>
                  )}

                  {qsParams?.isDeleted !== 'true' && canDelete && (
                    <Menu.Item
                      onClick={() => {
                        confirm({
                          icon: null,
                          content: t('common.confirmDeleteProject'),
                          onOk() {
                            mutationDeleteProject.mutateAsync();
                          },
                        });
                      }}
                    >
                      <TrashOutlined /> {t('common.deleteProject')}
                    </Menu.Item>
                  )}
                  {qsParams?.isDeleted === 'true' && canRestore && (
                    <Menu.Item
                      onClick={() => {
                        confirm({
                          icon: null,
                          content: t('common.confirmRestoreProject'),
                          onOk() {
                            mutationRestoreProject.mutateAsync();
                          },
                        });
                      }}
                    >
                      <Refresh /> {t('common.restoreProject')}
                    </Menu.Item>
                  )}
                </MenuDropDownWrapper>
              }
              trigger={['click']}
            />
          </div>
        ),
      },
    ],
    [navigate, qsParams, t, canDelete, canRestore, canUpdate],
  );

  const onRow = (record: IProject) => {
    return {
      onClick: () =>
        !qsParams?.isDeleted &&
        navigate(
          generatePath(projectRoutePath.SURVEY, { projectId: record.id }),
        ),
    };
  };

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
