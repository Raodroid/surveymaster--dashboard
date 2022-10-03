import { Table } from 'antd';
import { ROUTE_PATH } from 'enums';
import { CloseIcon } from 'icons';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { mockSurveyList } from '../../../mockup';
import { ProjectTableWrapper } from '../../style';
import ProjectHeader from '../Header';
import { SurveyWrapper } from './style';

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
    dataIndex: 'displayId',
    key: 'displayId',
  },
  {
    title: 'Survey Title',
    dataIndex: 'name',
    key: 'name',
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
    render: (_, record: any) => <CloseIcon />,
  },
];

function Survey() {
  const params = useParams();
  const navigate = useNavigate();

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);

  const routes = [
    {
      name: project?.name,
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + params.id,
    },
  ];

  const onRow = (record, rowIndex) => {
    return {
      onClick: () =>
        params &&
        params.id &&
        navigate(
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT.replace(
            ':id',
            params.id,
          ).replace(':detailId', record.name),
        ),
    };
  };

  return (
    <SurveyWrapper>
      <ProjectHeader routes={routes} />
      <ProjectTableWrapper>
        <Table dataSource={data} columns={columns} onRow={onRow} />
      </ProjectTableWrapper>
    </SurveyWrapper>
  );
}

export default Survey;
