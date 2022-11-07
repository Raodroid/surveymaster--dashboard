import { Button, Menu, PaginationProps, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { SCOPE_CONFIG } from 'enums';
import { PenFilled, TrashOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import _get from 'lodash/get';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { CustomSpinSuspense } from 'modules/common/styles';
import moment from 'moment';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import SimpleBar from 'simplebar-react';
import { GetListQuestionDto, IGetParams, IProject } from 'type';
import { MenuDropDownWrapper } from '../../../../../../customize-components/styles';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import { onError } from '../../../../../../utils';
import StyledPagination from '../../../../components/StyledPagination';
import { projectRoutePath } from '../../util';
import { DeleteProjectModal, RestoreProjectModal } from '../modals';
import { ProjectTableWrapper } from '../styles';
import { QsParams } from './ProjectFilter';

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

  const [params, setParams] = useState<GetListQuestionDto>(initParams);

  const [projectId, setProjectId] = useState('');
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showRestoreProject, setShowRestoreProject] = useState(false);

  const { canDelete, canRestore, canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.PROJECTS,
  );

  const formatQsParams = useMemo(() => {
    const formatQs: QsParams = {
      ...qsParams,
      createdFrom: moment(qsParams.createdFrom)?.startOf('day')?.format(),
      createdTo: moment(qsParams.createdTo)?.endOf('day')?.format(),
    };
    if (!qsParams.createdFrom) delete formatQs.createdFrom;
    if (!qsParams.createdTo) delete formatQs.createdTo;
    return formatQs;
  }, [qsParams]);

  const getProjectListQuery = useQuery(
    ['getProjects', params, formatQsParams],
    () =>
      getProjects({
        ...params,
        ...formatQsParams,
        isDeleted: formatQsParams.isDeleted === 'true' ? true : false,
      }),
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

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = useCallback(
    (current, pageSize) => {
      setParams(s => ({ ...s, take: pageSize }));
    },
    [],
  );

  const columns: ColumnsType<IProject> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'displayId',
        key: 'id',
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
      },
      {
        title: 'Person In Charge',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (_, record) => (
          <div>
            {`${record?.personResponsible?.firstName} ${record?.personResponsible?.lastName}`}
          </div>
        ),
      },
      {
        title: 'Date of Creation',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => {
          const str = text.toString();
          return <div>{str.slice(0, 10)}</div>;
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
          <div
            className="flex-center actions"
            onClick={e => {
              e.stopPropagation();
              setProjectId(record.id);
            }}
          >
            {qsParams?.isDeleted !== 'true' && canUpdate ? (
              <Button
                onClick={() =>
                  navigate(
                    generatePath(projectRoutePath.PROJECT.EDIT, {
                      projectId: record?.id,
                    }),
                  )
                }
              >
                <PenFilled />
              </Button>
            ) : null}
            <ThreeDotsDropdown
              overlay={
                <MenuDropDownWrapper>
                  {qsParams?.isDeleted !== 'true' && canDelete ? (
                    <Menu.Item onClick={() => setShowDeleteProject(true)}>
                      <TrashOutlined /> {t('common.deleteProject')}
                    </Menu.Item>
                  ) : null}
                  {qsParams?.isDeleted === 'true' && canRestore ? (
                    <Menu.Item onClick={() => setShowRestoreProject(true)}>
                      <Refresh /> {t('common.restoreProject')}
                    </Menu.Item>
                  ) : null}
                </MenuDropDownWrapper>
              }
              trigger={['click']}
            />
          </div>
        ),
      },
    ],
    [navigate, qsParams, t, canRestore, canDelete, canUpdate],
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
    <ProjectTableWrapper ref={wrapperRef} className="project-table-max-height">
      <CustomSpinSuspense
        spinning={
          getProjectListQuery.isLoading || getProjectListQuery.isFetching
        }
      >
        <SimpleBar style={{ height: '100%' }}>
          <Table
            pagination={false}
            dataSource={projects}
            columns={columns}
            onRow={onRow}
            rowKey={record => record.id as string}
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
        </SimpleBar>
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
