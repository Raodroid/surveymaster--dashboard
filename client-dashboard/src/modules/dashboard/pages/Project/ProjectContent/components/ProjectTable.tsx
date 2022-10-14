import { Button, Menu, PaginationProps, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { PenFilled, TrashOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import _get from 'lodash/get';
import { CustomSpinSuspense } from 'modules/common/styles';
import moment from 'moment';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import { GetListQuestionDto, IGetParams, IProject } from 'type';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import { onError } from '../../../../../../utils';
import StyledPagination from '../../../../components/StyledPagination';
import { projectRoutePath } from '../../util';
import { DeleteProjectModal, RestoreProjectModal } from '../modals';
import { ProjectTableWrapper, StyledProjectMenu } from '../styles';

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

type QsParams = {
  q?: string;
  isDeleted?: string;
  createdFrom?: string;
  createdTo?: string;
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
  const qsParams = useParseQueryString<IGetParams>();

  const [params, setParams] = useState<GetListQuestionDto>(initParams);

  const [projectId, setProjectId] = useState('');
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showRestoreProject, setShowRestoreProject] = useState(false);

  const formatQsParams = useMemo(() => {
    const formatQs: IGetParams = {
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
      }),
    {
      onError,
      refetchOnWindowFocus: false,
    },
  );

  console.log(qsParams);

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
            {!qsParams?.isDeleted && (
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
            )}
            <ThreeDotsDropdown
              overlay={
                <StyledProjectMenu>
                  {!qsParams?.isDeleted && (
                    <Menu.Item onClick={() => setShowDeleteProject(true)}>
                      <TrashOutlined /> {t('common.deleteProject')}
                    </Menu.Item>
                  )}
                  {qsParams?.isDeleted && (
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
    [navigate, qsParams, t],
  );

  const onRow = (record: any) => {
    return {
      onClick: () =>
        !qsParams?.isDeleted &&
        navigate(
          generatePath(projectRoutePath.SURVEY, { projectId: record.id }),
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
