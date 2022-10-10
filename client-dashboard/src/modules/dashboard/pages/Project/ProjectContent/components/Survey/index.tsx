import { Menu, notification, Pagination, Table } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { PenFilled, TrashOutlined } from 'icons';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import { SurveyService } from '../../../../../../../services';
import { ISurvey } from '../../../../../../../type';
import { onError } from '../../../../../../../utils';
import ProjectHeader from '../Header';
import { SurveyWrapper, TableWrapper } from './style';
import { useState } from 'react';
import { CustomSpinSuspense } from 'modules/common/styles';

function Survey() {
  const params = useParams<{ id?: string }>();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  const title = useMemo(
    () => search.replace('?projectName=', '').replace(/%20/g, ' '),
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
    () => SurveyService.getSurveys(queryParams),
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
    [],
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
          ).replace(':detailId', record.id) + `?projectName=${title}`,
        ),
    };
  };

  return (
    <SurveyWrapper className="flex-column">
      <ProjectHeader routes={routes} />

      <TableWrapper className="flex-column">
        <CustomSpinSuspense spinning={isLoading}>
          <Table
            dataSource={survey?.data.data}
            columns={columns}
            onRow={onRow}
            pagination={false}
          />
          <Pagination defaultCurrent={1} />
        </CustomSpinSuspense>
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
