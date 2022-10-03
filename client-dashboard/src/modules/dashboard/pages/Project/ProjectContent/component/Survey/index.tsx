import { Menu, Table } from 'antd';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { CloseIcon, PenFilled } from 'icons';
import React, { useMemo } from 'react';
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

function Survey() {
  const params = useParams();
  const navigate = useNavigate();

  const { data } = mockSurveyList;
  const project = data.filter(elm => elm.project?.displayId === params.id);

  const routes = useMemo(
    () => [
      {
        name: project[0]?.name,
        href: '',
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'displayId',
        key: 'displayId',
      },
      {
        title: 'Survey Title',
        dataIndex: 'name',
        key: 'name',
        render: () => <div>{project[0]?.project?.name}</div>,
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
          <div
            className="flex-center actions"
            onClick={e => e.stopPropagation()}
          >
            <ThreeDotsDropdown
              overlay={
                <Menu
                  items={[
                    {
                      key: 1,
                      label: (
                        <div
                          onClick={() =>
                            params &&
                            params.id &&
                            navigate(
                              ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT.replace(
                                ':id',
                                params.id,
                              ).replace(':detailId', record.displayId),
                            )
                          }
                        >
                          <PenFilled /> Edit Survey
                        </div>
                      ),
                    },
                  ]}
                />
              }
              trigger={['click']}
            />
          </div>
        ),
      },
    ],
    [project],
  );

  const onRow = (record, rowIndex) => {
    return {
      onClick: () =>
        params &&
        params.id &&
        navigate(
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT.replace(
            ':id',
            params.id,
          ).replace(':detailId', record.displayId),
        ),
    };
  };

  return (
    <SurveyWrapper>
      <ProjectHeader routes={routes} />
      <ProjectTableWrapper>
        <Table
          dataSource={project}
          columns={columns}
          onRow={onRow}
          pagination={false}
        />
      </ProjectTableWrapper>
    </SurveyWrapper>
  );
}

export default Survey;
