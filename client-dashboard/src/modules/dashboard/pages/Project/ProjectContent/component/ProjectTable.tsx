import { Button, Menu, Pagination, Table } from 'antd';
import CustomTable from 'customize-components/CustomTable';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { PenFilled } from 'icons';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import { BooleanEnum } from 'type';
import { ProjectTableWrapper } from '../style';

function ProjectTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isDeleted, setIsDeleted] = useState(BooleanEnum.FALSE);

  const queryParams = {
    q: query,
    page: page,
    take: 10,
    isDeleted: isDeleted,
  };

  const { data: projects, isLoading } = useQuery(
    'projectData',
    () => ProjectService.getProjects(queryParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'project',
        key: 'project',
        render: (_, record: any) => <div>{record?.id}</div>,
      },
      {
        title: 'Project Title',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any) => (
          <Link
            to={
              ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(
                ':id',
                record?.id,
              ) + `?title=${record.name}`
            }
          >
            {text}
          </Link>
        ),
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
            {record.personResponsible.firstName}{' '}
            {record.personResponsible.lastName}
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
          <div className="flex-center actions">
            <Button
              onClick={() =>
                navigate(
                  ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.EDIT.replace(
                    ':id',
                    record.id,
                  ),
                )
              }
            >
              <PenFilled />
            </Button>
            <ThreeDotsDropdown overlay={<Menu />} trigger={['click']} />
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <ProjectTableWrapper className="flex-column">
      <Table
        dataSource={projects?.data.data}
        columns={columns}
        pagination={false}
        // scroll={{ y: 'calc(100vh - 286px)' }}
      />
      <Pagination />
    </ProjectTableWrapper>
  );
}

export default ProjectTable;
