import { Table } from 'antd';
import { ROUTE_PATH } from 'enums';
import { CloseIcon } from 'icons';
import React from 'react';
import { useParams } from 'react-router';
import { ProjectTableWrapper } from '../../style';
import ProjectHeader from '../Header';

const dataSource = [
  {
    key: '1',
    id: '113-8392',
    projectTitle: 'Microbiome Donor Programme (AMD)',
    nOfSurveys: '56',
    personInCharge: 'Dorothy Hernandez',
    dateOfCreation: '13.08.2022',
  },
  {
    key: '2',
    id: '113-8392',
    projectTitle: 'Donor V2',
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
    render: (_, record: any) => <CloseIcon />,
  },
];

function DetailSurvey() {
  const params = useParams();
  const routes = [
    {
      name: params.id,
      href:
        params &&
        params.id &&
        ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', params.id),
    },
    {
      name: params.detailId,
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY.replace(
        ':id',
        params.id || '',
      ),
    },
  ];

  return (
    <>
      <ProjectHeader routes={routes} />
      <ProjectTableWrapper>
        <Table dataSource={dataSource} columns={columns} />
      </ProjectTableWrapper>
    </>
  );
}

export default DetailSurvey;
