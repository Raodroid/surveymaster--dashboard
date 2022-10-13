import { Menu, notification, PaginationProps, Table } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import useParseQueryString from 'hooks/useParseQueryString';
import { ProjectTableWrapper } from '../../style';
import { PenFilled, TrashOutlined } from 'icons';
import _get from 'lodash/get';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { CustomSpinSuspense } from 'modules/common/styles';
import StyledPagination from 'modules/dashboard/components/StyledPagination';
import moment from 'moment';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ColumnsType } from 'antd/lib/table/interface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import styled from 'styled-components';
import { ProjectService, SurveyService } from '../../../../../../../services';
import {
  GetListQuestionDto,
  IGetParams,
  ISurvey,
} from '../../../../../../../type';
import { onError } from '../../../../../../../utils';
import { projectRoutePath } from '../../../util';
import ProjectHeader from '../Header';
import { QsParams } from '../Header/ProjectFilter';
import { SurveyWrapper, TableWrapper } from './style';
import { CustomSpinSuspense } from 'modules/common/styles';

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

function Survey() {
  const params = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const qsParams = useParseQueryString<QsParams>();

  const [paramsQuery, setParamsQuery] =
    useState<GetListQuestionDto>(initParams);

  const formatQsParams = useMemo(() => {
    const formatQs: QsParams = {
      ...qsParams,
      createdFrom: moment(qsParams.createdFrom)?.startOf('day')?.format(),
      createdTo: moment(qsParams.createdTo)?.endOf('day')?.format(),
    };
    if (!qsParams.createdFrom) delete formatQs.createdFrom;
    if (!qsParams.createdTo) delete formatQs.createdTo;
    return formatQs;
  }, [qsParams]);

  const { data: project } = useQuery(['project', params.projectId], () =>
    ProjectService.getProjectById(params.projectId),
  );

  const getSurveyListQuery = useQuery(
    ['getSurveys', formatQsParams, paramsQuery, params],
    () =>
      SurveyService.getSurveys({
        ...paramsQuery,
        ...formatQsParams,
        projectId: params.projectId,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  const total: number = _get(getSurveyListQuery.data, 'data.itemCount', 0);

  const surveys = useMemo<ISurvey[]>(
    () => _get(getSurveyListQuery.data, 'data.data'),
    [getSurveyListQuery.data],
  );

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = useCallback(
    (current, pageSize) => {
      setParamsQuery(s => ({ ...s, take: pageSize }));
    },
    [],
  );

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.data.name || '...',
        href: projectRoutePath.SURVEY,
      },
    ],
    [project],
  );

  const columns: ColumnsType<ISurvey> = useMemo(
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
        render: (text: Date) => {
          const str = text.toString();
          return <div>{str.slice(0, 10)}</div>;
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: 100,
        render: (_, record: ISurvey) => (
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
        navigate(
          generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
            projectId: params?.projectId,
            surveyId: record.id,
          }),
        ),
    };
  };

  return (
    <SurveyWrapper className="flex-column">
      <ProjectHeader routes={routes} search />

      <TableWrapper className="flex-column project-table-max-height">
        <CustomSpinSuspense
          spinning={
            getSurveyListQuery.isLoading || getSurveyListQuery.isFetching
          }
        >
          <SimpleBar style={{ height: '100%' }}>

                <Table
                  dataSource={surveys}
                  columns={columns}
                  onRow={onRow}
                  pagination={false}
                  rowKey={record => record.id as string}
                />
            <StyledPagination
              onChange={page => {
                setParamsQuery(s => ({ ...s, page }));
              }}
              showSizeChanger
              pageSize={paramsQuery.take}
              onShowSizeChange={onShowSizeChange}
              defaultCurrent={1}
              total={total}
            />
          </SimpleBar>
        </CustomSpinSuspense>
      </TableWrapper>
    </SurveyWrapper>
  );
};

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
  const params = useParams<{ projectId?: string }>();

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
          if (!params?.projectId) return;
          navigate(
            generatePath(projectRoutePath.DETAIL_SURVEY.EDIT, {
              projectId: params?.projectId,
              surveyId: record.displayId,
            }),
          );
          return;
        }
      }
    },
    [duplicateMutation, navigate, params],
  );

  const menu = (
    <SurveyMenu
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

const SurveyMenu = styled(Menu)`
  svg {
    width: 14px;
    height: 14px;
    color: var(--ant-primary-color);
  }
`;
