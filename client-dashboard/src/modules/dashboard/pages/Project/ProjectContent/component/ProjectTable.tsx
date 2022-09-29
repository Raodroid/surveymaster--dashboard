import { Table } from 'antd';
import { ROUTE_PATH } from 'enums';
import { CloseIcon } from 'icons';
import React from 'react';
import { Link } from 'react-router-dom';
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

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Project Title',
    dataIndex: 'projectTitle',
    key: 'projectTitle',
    render: (text: string, record: any) => (
      <Link
        to={ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(
          ':id',
          record.route,
        )}
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'N of Surveys',
    dataIndex: 'nOfSurveys',
    key: 'nOfSurveys',
  },
  {
    title: 'Person In Charge',
    dataIndex: 'personInCharge',
    key: 'personInCharge',
  },
  {
    title: 'Date of Creation',
    dataIndex: 'dateOfCreation',
    key: 'dateOfCreation',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: (_, record: any) => <div className="flex"></div>,
  },
];

function ProjectTable() {
  return (
    <ProjectTableWrapper>
      <Table pagination={false} dataSource={dataSource} columns={columns} />
    </ProjectTableWrapper>
  );
}

export default ProjectTable;
