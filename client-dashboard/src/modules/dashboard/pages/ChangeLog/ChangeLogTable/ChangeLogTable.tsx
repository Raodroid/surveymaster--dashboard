import { ColumnsType } from 'antd/lib/table';
import { IGetParams, ProjectQueryParam, ProjectTypes, QsParams } from '@/type';
import { Avatar, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import { StyledPagination } from '@components/index';
import { useHandleNavigate, useParseQueryString } from '@/hooks';
import { objectKeys } from '@/utils';
import moment from 'moment';
import { ChangeLog } from '@/type/change-log';
import { CustomTable } from '@/customize-components';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { generatePath } from 'react-router';
import { ROUTE_PATH } from '@/enums';

const dataSource: Array<ChangeLog> = [
  {
    id: Math.random().toString(),
    type: 'Survey',
    createdAt: '2023-12-14T09:01:45.853Z',
    displayId: 'TZ8E-RO8I-OT8N',
    event: 'Create Survey was created',
    actionBy: {
      id: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
      email: 'vanbt@mailinator.com',
      firstName: 'Van',
      lastName: 'Bui',
      phone: '21212121',
      smsVerified: false,
      avatar: 'https://cdn.survey-master.dev.bioandme.asia/avatar/avatar1.png',
      departmentName: 'IT Developer',
    },
    survey: {
      id: Math.random(),
      name: 'Poop Saved life',
    },
    action: 'CREATE',
    project: {
      id: '',
      name: "Van's project",
    },
    actions: [
      {
        createdAt: '2023-12-14T09:01:45.853Z',
        updatedAt: '2023-12-14T09:01:45.853Z',
        id: '7469',
        surveyId: '36',
        actionType: 'SURVEY_VERSION_CREATED',
        name: 'Remove question “What is your name”?',
        createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
        survey: {
          createdAt: '2023-12-14T09:01:45.853Z',
          updatedAt: '2023-12-14T09:01:45.853Z',
          deletedAt: null,
          id: '36',
          displayId: 'GX1D-6TFN-U7Q2',
          projectId: '1',
        },
        owner: {
          id: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
          email: 'vanbt@mailinator.com',
          firstName: 'Van',
          lastName: 'Bui',
          phone: '21212121',
          smsVerified: false,
          avatar:
            'https://cdn.survey-master.dev.bioandme.asia/avatar/avatar1.png',
          departmentName: 'IT Developer',
        },
      },
      {
        createdAt: '2023-12-14T09:01:45.853Z',
        updatedAt: '2023-12-14T09:01:45.853Z',
        id: '746945',
        name: 'Add question “What is your age?',
        surveyId: '36',
        actionType: 'SURVEY_VERSION_CREATED',
        createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
        survey: {
          createdAt: '2023-12-14T09:01:45.853Z',
          updatedAt: '2023-12-14T09:01:45.853Z',
          deletedAt: null,
          id: '36',
          displayId: 'GX1D-6TFN-U7Q2',
          projectId: '1',
        },
        owner: {
          id: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
          email: 'vanbt@mailinator.com',
          firstName: 'Van',
          lastName: 'Bui',
          phone: '21212121',
          smsVerified: false,
          avatar:
            'https://cdn.survey-master.dev.bioandme.asia/avatar/avatar1.png',
          departmentName: 'IT Developer',
        },
      },
    ],
  },
  {
    id: Math.random().toString(),
    type: 'Survey',
    createdAt: '2023-12-14T09:01:45.853Z',
    displayId: 'TZ8E-RO8I-OT8N',
    event: 'Update question version',
    actionBy: {
      id: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
      email: 'vanbt@mailinator.com',
      firstName: 'Van',
      lastName: 'Bui',
      phone: '21212121',
      smsVerified: false,
      avatar: 'https://cdn.survey-master.dev.bioandme.asia/avatar/avatar1.png',
      departmentName: 'IT Developer',
    },
    action: 'CREATE',
    project: {
      id: '',
      name: "Van's project",
    },
    actions: [
      {
        createdAt: '2023-12-14T09:01:45.853Z',
        updatedAt: '2023-12-14T09:01:45.853Z',
        id: '7469',
        surveyId: '36',
        actionType: 'SURVEY_VERSION_CREATED',
        name: 'Change question type from “Text” to “Rank”',
        createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
        survey: {
          createdAt: '2023-12-14T09:01:45.853Z',
          updatedAt: '2023-12-14T09:01:45.853Z',
          deletedAt: null,
          id: '36',
          displayId: 'GX1D-6TFN-U7Q2',
          projectId: '1',
        },
        owner: {
          id: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
          email: 'vanbt@mailinator.com',
          firstName: 'Van',
          lastName: 'Bui',
          phone: '21212121',
          smsVerified: false,
          avatar:
            'https://cdn.survey-master.dev.bioandme.asia/avatar/avatar1.png',
          departmentName: 'IT Developer',
        },
      },
      {
        createdAt: '2023-12-14T09:01:45.853Z',
        updatedAt: '2023-12-14T09:01:45.853Z',
        id: '746945',
        name: 'Change question title from “What is your name?” to “What is your age"',
        surveyId: '36',
        actionType: 'SURVEY_VERSION_CREATED',
        createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
        survey: {
          createdAt: '2023-12-14T09:01:45.853Z',
          updatedAt: '2023-12-14T09:01:45.853Z',
          deletedAt: null,
          id: '36',
          displayId: 'GX1D-6TFN-U7Q2',
          projectId: '1',
        },
        owner: {
          id: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
          email: 'vanbt@mailinator.com',
          firstName: 'Van',
          lastName: 'Bui',
          phone: '21212121',
          smsVerified: false,
          avatar:
            'https://cdn.survey-master.dev.bioandme.asia/avatar/avatar1.png',
          departmentName: 'IT Developer',
        },
      },
    ],
  },
];

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

const ChangeLogTable = () => {
  const { t } = useTranslation();
  const handleNavigate = useHandleNavigate(initParams);
  const qsParams = useParseQueryString<
    QsParams & { type: ProjectTypes | 'All' }
  >();
  const columns: ColumnsType<ChangeLog> = useMemo(
    () => [
      {
        title: 'Id',
        dataIndex: 'displayId',
        key: 'id',
        width: 150,
        render: (value, record) => {
          if (record.deletedAt) {
            return value;
          }
          return (
            <Link
              className={'font-semibold text-[12px]'}
              to={generatePath(
                ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
                {
                  projectId: record.project?.id,
                  surveyId: record.id,
                },
              )}
            >
              {value}
            </Link>
          );
        },
      },
      {
        title: t('common.projectName'),
        dataIndex: ['project', 'name'],
        key: 'projectName',
        render: value => value || '--',
      },
      {
        title: t('common.surveyName'),
        dataIndex: ['survey', 'name'],
        key: 'surveyName',
        render: value => value || '--',
      },

      {
        title: t('common.action'),
        dataIndex: 'event',
        key: 'event',
      },
      {
        title: 'Action By',
        dataIndex: 'actionBy',
        key: 'actionBy',
        render: (value, record) => {
          return (
            <span className={'flex gap-3 items-center'}>
              <Avatar src={record?.actionBy.avatar} />
              <span>{`${record.actionBy.firstName || ''} ${
                record.actionBy.lastName
              } `}</span>
            </span>
          );
        },
      },
      {
        title: t('common.dateOfCreation'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: value => {
          return <div>{!value ? '--' : moment(value).fromNow()}</div>;
        },
      },
    ],
    [t],
  );

  const formatQsParams = useMemo(() => {
    const formatQs: ProjectQueryParam = {
      q: qsParams.q || initParams.q,
      page: Number(qsParams.page) || initParams.page,
      take: Number(qsParams.take) || initParams.take,
      isDeleted: qsParams.isDeleted === 'true',
      types:
        qsParams.type === 'All'
          ? objectKeys(ProjectTypes).map(key => ProjectTypes[key])
          : [qsParams.type],
    };

    if (qsParams.createdFrom) {
      formatQs.createdFrom = moment(qsParams.createdFrom)
        ?.startOf('day')
        ?.format();
    }
    if (qsParams.createdTo) {
      formatQs.createdTo = moment(qsParams.createdTo)?.endOf('day')?.format();
    }
    return formatQs;
  }, [qsParams]);

  const total = 0;

  return (
    <div className={'p-3 flex-1 flex flex-col'}>
      <SimpleBar className={'flex-1'}>
        <div className={'p-3 pr-1'}>
          <CustomTable
            dataSource={dataSource.map(i => ({ ...i, id: Math.random() }))}
            rowKey={record => record.id}
            columns={columns}
            pagination={false}
            scroll={{ x: 800 }}
            expandable={{
              expandedRowRender: record => (
                <span style={{ margin: 0 }}>
                  {record.actions.map(i => (
                    <div className={'ml-6 mt-3'} key={i.id}>
                      {i.name}
                    </div>
                  ))}
                </span>
              ),
            }}
          />
        </div>
      </SimpleBar>

      <Divider className={'m-0'} />

      <StyledPagination
        onChange={(page, pageSize) => {
          handleNavigate({ page, take: pageSize });
        }}
        showSizeChanger
        pageSize={formatQsParams.take}
        total={total}
        current={formatQsParams.page}
      />
    </div>
  );
};

export default ChangeLogTable;
