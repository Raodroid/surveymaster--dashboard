import { Menu, Pagination, Table } from 'antd';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { CloseIcon, PenFilled } from 'icons';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { ProjectService } from 'services';
import { mockSurveyList } from '../../../mockup';
import { ProjectTableWrapper } from '../../style';
import ProjectHeader from '../Header';
import { SurveyWrapper, TableWrapper } from './style';
import { useState } from 'react';
import { BooleanEnum } from 'type';
import { useLocation } from 'react-router';
import { CustomSpinSuspense } from 'modules/common/styles';
import SimpleBar from 'simplebar-react';

function Survey() {
  const params = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isDeleted, setIsDeleted] = useState(BooleanEnum.FALSE);

  const title = useMemo(
    () => search.replace('?title=', '').replace(/%20/g, ' '),
    [search],
  );

  const queryParams = {
    q: query,
    page: page,
    take: 10,
    isDeleted: isDeleted,
    projectId: params.id,
  };

  const { data: survey, isLoading } = useQuery(
    ['survey', params.id],
    () => ProjectService.getSurveys(queryParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const routes = useMemo(
    () => [
      {
        name: title,
        href: '',
      },
    ],
    [title],
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
      },
      {
        title: 'N of Questions',
        dataIndex: 'numberOfQuestions',
        key: 'numberOfQuestions',
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
                          <PenFilled /> {t('common.editSurvey')}
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
    [navigate, t, params],
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
    <SurveyWrapper className="flex-column">
      <ProjectHeader routes={routes} />

      <TableWrapper className="flex-column">
        <Table
          dataSource={survey?.data.data}
          columns={columns}
          onRow={onRow}
          pagination={false}
          loading={isLoading}
          scroll={{ y: 'calc(100vh - 286px)' }}
        />
        <Pagination />
      </TableWrapper>
    </SurveyWrapper>
  );
}

export default Survey;
