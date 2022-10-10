import { Menu, notification, Table } from 'antd';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { CloseIcon, PenFilled, TrashOutlined } from 'icons';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { ProjectTableWrapper } from '../../style';
import ProjectHeader from '../Header';
import { SurveyWrapper, TableWrapper } from './style';
import { useState } from 'react';
import { BooleanEnum } from 'type';
import { useLocation } from 'react-router';
import { CustomSpinSuspense } from 'modules/common/styles';
import SimpleBar from 'simplebar-react';

function Survey() {
  const params = useParams<{ id?: string }>();
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
        width: 30,
        render: (_, record: any) => (
          <div
            className="flex-center actions"
            onClick={e => e.stopPropagation()}
          >
            <DropDownMenu record={record} />
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
          // scroll={{ x: 1500 }}
        />
        <Pagination />
      </TableWrapper>
    </SurveyWrapper>
  );
}

export default Survey;
interface IDropDownMenu {
  record: ISurvey;
}

enum ACTION_ENUM {
  DUPLICATE_SURVEY = 'DUPLICATE_SURVEY',
  EDIT = 'EDIT',
}

const DropDownMenu: FC<IDropDownMenu> = props => {
  const { record } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  const duplicateMutation = useMutation(
    (data: { id: string }) => {
      return SurveyService.duplicateSurvey(data as any);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getProjects');
        notification.success({ message: t('common.duplicateSuccess') });
      },
      onError,
    },
  );

  const items = useMemo(() => {
    const baseMenu: ItemType[] = [
      {
        icon: <TrashOutlined />,
        label: t('common.duplicateSurvey'),
        key: ACTION_ENUM.DUPLICATE_SURVEY,
      },
      {
        icon: <PenFilled />,
        label: t('common.edit'),
        key: ACTION_ENUM.EDIT,
      },
    ];

    return baseMenu;
  }, [t]);

  const handleSelect = useCallback(
    async (props: {
      record: ISurvey;
      key: string;
      keyPath: string[];
      item: React.ReactInstance;
    }) => {
      const { key, record } = props;
      switch (key) {
        case ACTION_ENUM.DUPLICATE_SURVEY: {
          await duplicateMutation.mutateAsync({ id: record.id as string });
          return;
        }
        case ACTION_ENUM.EDIT: {
          if (!params.id) return;
          navigate(
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT.replace(
              ':id',
              params.id,
            ).replace(':detailId', record.displayId),
          );
          return;
        }
      }
    },
    [duplicateMutation, navigate, params.id],
  );

  const menu = (
    <Menu
      onClick={input => {
        handleSelect({ ...input, record }).then();
      }}
      items={items}
    />
  );

  return (
    <ThreeDotsDropdown
      overlay={menu}
      placement="bottomLeft"
      trigger={'click' as any}
    />
  );
};
