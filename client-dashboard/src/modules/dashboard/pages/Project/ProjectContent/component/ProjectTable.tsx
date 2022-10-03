import { Table } from 'antd';
import { ROUTE_PATH } from 'enums';
import { CloseIcon, PenFilled } from 'icons';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import { BooleanEnum } from 'type';
import { mockSurveyList } from '../../mockup';
import { ProjectTableWrapper } from '../style';

const dataSource = [
  {
    key: '1',
    id: '113-8392',
    projectTitle: 'Microbiome Donor Programme (AMD)',
    route: 'Microbiome-Donor-Programme (AMD)',
    nOfSurveys: '56',
    personInCharge: 'Dorothy Hernandez',
    dateOfCreation: '13.08.2022',
  },
  {
    key: '2',
    id: '113-8392',
    projectTitle: 'Microbiome Donor Programme (AMD)',
    route: 'Microbiome-Donor-Programme-(AMD)',
    nOfSurveys: '56',
    personInCharge: 'Dorothy Hernandez',
    dateOfCreation: '13.08.2022',
  },
];

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
  // const { data: projects } = useQuery(
  //   'projects',
  //   () => ProjectService.getProjects(queryParams),
  //   {
  //     refetchOnWindowFocus: false,
  //   },
  // );

  const { data } = mockSurveyList;

  console.log(data);

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'project',
        key: 'project',
        render: (project: any) => <div>{project.displayId}</div>,
      },
      {
        title: 'Project Title',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any) => (
          <Link
            to={ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(
              ':id',
              record.project.displayId,
            )}
          >
            {text}
          </Link>
        ),
      },
      {
        title: 'N of Surveys',
        dataIndex: 'questions',
        key: 'questions',
        render: (list: any) => <div>{list.length}</div>,
      },
      {
        title: 'Person In Charge',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (user: any) => <div>{user.fullName}</div>,
      },
      {
        title: 'Date of Creation',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: any) => {
          const str = text.toString();
          return <div>{str.slice(0, 15)}</div>;
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record: any) => (
          <div className="flex">
            <PenFilled
              onClick={() =>
                navigate(
                  ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.EDIT.replace(
                    ':id',
                    record.project.displayId,
                  ) + `?title=${record.name}`,
                )
              }
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <ProjectTableWrapper>
      <Table pagination={false} dataSource={data} columns={columns} />
    </ProjectTableWrapper>
  );
}

export default ProjectTable;
