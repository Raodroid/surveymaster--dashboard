import { Button, Menu, PaginationProps, Table } from 'antd';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { PenFilled, TrashOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import _get from 'lodash/get';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import { GetListQuestionDto, IGetParams, IProject } from 'type';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import { onError, useDebounce } from '../../../../../../utils';
import StyledPagination from '../../../../components/StyledPagination';
import { DeleteProjectModal, RestoreProjectModal } from '../modals';
import { ProjectTableWrapper, StyledProjectMenu } from '../styles';
import { useTranslation } from 'react-i18next';

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

function ProjectTable(props: {
  filterValue?: string;
  queryParams?: IGetParams;
}) {
  const { filterValue, queryParams } = props;
  const wrapperRef = useRef<any>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchTxt, setSearchTxt] = useState<string>('');
  const queryString = useParseQueryString<GetListQuestionDto>();
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
  const [params, setParams] = useState<GetListQuestionDto>(initParams);
  const debounceSearchText = useDebounce(searchTxt);

  const [projectId, setProjectId] = useState('');
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showRestoreProject, setShowRestoreProject] = useState(false);

  const getProjectListQuery = useQuery(
    ['getProjects', params, debounceSearchText, queryParams, filterValue],
    () =>
      getProjects({
        ...params,
        ...queryParams,
        q: filterValue,
      }),
    {
      onError,
    },
  );

  const total: number = _get(getProjectListQuery.data, 'data.itemCount', 0);

  const projects = useMemo<IProject[]>(
    () => _get(getProjectListQuery.data, 'data.data'),
    [getProjectListQuery.data],
  );

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = useCallback(
    (current, pageSize) => {
      setParams(s => ({ ...s, take: pageSize }));
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'project',
        key: 'project',
        render: (_, record: any) => <div>{record?.displayId}</div>,
      },
      {
        title: 'Project Title',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'N of Surveys',
        dataIndex: 'numberOfSurveys',
        key: 'numberOfSurveys',
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: 'Person In Charge',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (_, record: any) => (
          <div>
            {record?.personResponsible?.firstName}{' '}
            {record?.personResponsible?.lastName}
          </div>
        ),
      },
      {
        title: 'Date of Creation',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: any) => {
          const str = text.toString();
          return <div>{str.slice(0, 10)}</div>;
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record: any) => (
          <div
            className="flex-center actions"
            onClick={e => {
              e.stopPropagation();
              setProjectId(record.id);
            }}
          >
            {!queryParams?.isDeleted && (
              <Button
                onClick={() =>
                  navigate(
                    routePath.PROJECT.EDIT.replace(':id', record.id) +
                      `?projectName=${record.name}`,
                  )
                }
              >
                <PenFilled />
              </Button>
            )}
            <ThreeDotsDropdown
              overlay={
                <StyledProjectMenu>
                  {!queryParams?.isDeleted && (
                    <Menu.Item onClick={() => setShowDeleteProject(true)}>
                      <TrashOutlined /> {t('common.deleteProject')}
                    </Menu.Item>
                  )}
                  {queryParams?.isDeleted && (
                    <Menu.Item onClick={() => setShowRestoreProject(true)}>
                      <Refresh /> {t('common.restoreProject')}
                    </Menu.Item>
                  )}
                </StyledProjectMenu>
              }
              trigger={['click']}
            />
          </div>
        ),
      },
    ],
    [navigate, routePath, queryParams],
  );

  const onRow = (record: any) => {
    return {
      onClick: () =>
        !queryParams?.isDeleted &&
        navigate(
          routePath.SURVEY.replace(':id', record?.id) +
            `?projectName=${record?.name}`,
        ),
    };
  };

  return (
    <ProjectTableWrapper ref={wrapperRef}>
      <CustomSpinSuspense spinning={getProjectListQuery.isLoading}>
        <Table
          pagination={false}
          dataSource={projects}
          columns={columns}
          onRow={onRow}
        />
        <StyledPagination
          onChange={page => {
            setParams(s => ({ ...s, page }));
          }}
          showSizeChanger
          pageSize={params.take}
          onShowSizeChange={onShowSizeChange}
          defaultCurrent={1}
          total={total}
        />
      </CustomSpinSuspense>

      <DeleteProjectModal
        setShowModal={setShowDeleteProject}
        showModal={showDeleteProject}
        projectId={projectId}
      />
      <RestoreProjectModal
        setShowModal={setShowRestoreProject}
        showModal={showRestoreProject}
        projectId={projectId}
      />
    </ProjectTableWrapper>
  );
}

export default ProjectTable;
