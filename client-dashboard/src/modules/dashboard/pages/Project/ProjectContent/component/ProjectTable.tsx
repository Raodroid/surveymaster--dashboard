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

function ProjectTable(props: { filterValue?: string }) {
  const { filterValue } = props;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isDeleted, setIsDeleted] = useState(BooleanEnum.FALSE);
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;

  const queryParams = {
    q: filterValue,
    page: page,
    take: 10,
    isDeleted: isDeleted,
  };

  const { data: projects, isLoading } = useQuery(
    ['projects', filterValue, page, isDeleted],
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
              routePath.SURVEY.replace(':id', record?.id) +
              `?projectName=${record.name}`
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
                  routePath.PROJECT.EDIT.replace(':id', record.id) +
                    `?projectName=${record.name}`,
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
    [navigate, routePath],
  );

  return (
    <ProjectTableWrapper className="flex-column">
      <Table
        dataSource={projects?.data.data}
        columns={columns}
        pagination={false}
        // scroll={{ y: 'calc(100vh - 286px)' }}
        loading={isLoading}
      />
      <Pagination defaultCurrent={page} />
    </ProjectTableWrapper>
  );
}

export default ProjectTable;
