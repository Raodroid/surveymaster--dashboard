import { Menu, notification, Pagination, Table } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { PenFilled, TrashOutlined } from 'icons';
import { CustomSpinSuspense } from 'modules/common/styles';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import { SurveyService } from '../../../../../../../services';
import { IGetParams, ISurvey } from '../../../../../../../type';
import { onError, useDebounce } from '../../../../../../../utils';
import {
  createProjectDetailLink,
  getProjectTitle,
  projectRoutePath,
} from '../../../util';
import ProjectHeader from '../Header';
import { SurveyWrapper, TableWrapper } from './style';

function Survey() {
  const params = useParams<{ id?: string }>();
  const { search } = useLocation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [headerSearch, setHeaderSearch] = useState('');
  const [filter, setFilter] = useState('');
  const debounce = useDebounce(headerSearch);

  const [filterParams, setFilterParams] = useState<IGetParams>({
    isDeleted: false,
    createdFrom: '',
    createdTo: '',
  });

  const title = useMemo(() => getProjectTitle(search), [search]);

  const queryParams = useMemo(() => {
    return {
      q: filter,
      page: page,
      take: 10,
      isDeleted: filterParams.isDeleted,
      projectId: params.id,
    };
  }, [filter, page, params, filterParams]);

  const { data: survey, isLoading } = useQuery(
    ['survey', params.id, filterParams, filter, queryParams],
    () =>
      filterParams.createdFrom || filterParams.createdTo
        ? SurveyService.getSurveys({
            ...queryParams,
            createdFrom: filterParams.createdFrom,
            createdTo: filterParams.createdTo,
          })
        : SurveyService.getSurveys(queryParams),
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

  const onRow = record => {
    return {
      onClick: () =>
        params &&
        params.id &&
        navigate(
          createProjectDetailLink(
            projectRoutePath.DETAIL_SURVEY.ROOT,
            params.id,
            record.id,
            title,
          ),
        ),
    };
  };

  return (
    <SurveyWrapper className="flex-column">
      <ProjectHeader
        routes={routes}
        search={headerSearch}
        setSearch={setHeaderSearch}
        setFilter={setFilter}
        debounce={debounce}
        setParams={setFilterParams}
      />

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
            createProjectDetailLink(
              projectRoutePath.DETAIL_SURVEY.EDIT,
              params.id,
              record.displayId,
            ),
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
