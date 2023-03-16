import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { MOMENT_FORMAT } from 'enums';
import useHandleNavigate from 'hooks/useHandleNavigate';
import useParseQueryString from 'hooks/useParseQueryString';

import _get from 'lodash/get';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import StyledPagination from 'modules/dashboard/components/StyledPagination';
import moment from 'moment';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import { ProjectService, SurveyService } from 'services';
import SimpleBar from 'simplebar-react';
import { IGetParams, ISurvey } from 'type';
import HannahCustomSpin from '../../../../../components/HannahCustomSpin';
import { projectRoutePath } from '../../../util';
import ProjectHeader from '../Header';
import { QsParams } from '../project-filter/ProjectFilter';
import { SurveyWrapper, TableWrapper } from './style';
import { SurveyDropDownMenu } from './SurveyDropDown';
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
  const { t } = useTranslation();
  const handleNavigate = useHandleNavigate(initParams);

  const formatQsParams = useMemo(() => {
    const formatQs: IGetParams = {
      q: qsParams.q || initParams.q,
      page: Number(qsParams.page) || initParams.page,
      take: Number(qsParams.take) || initParams.take,
      isDeleted: qsParams.isDeleted === 'true',
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
    ['getSurveys', formatQsParams, params],
    () =>
      SurveyService.getSurveys({
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
        width: 150,
      },
      {
        title: t('common.surveyTitle'),
        dataIndex: ['latestVersion', 'name'],
        key: 'name',
      },
      {
        title: t('common.numberOfQuestions'),
        dataIndex: ['latestVersion', 'numberOfQuestions'],
        key: 'numberOfQuestions',
        width: 200,
      },
      {
        title: t('common.dateOfCreation'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 200,
        render: (text: Date) => {
          return text
            ? moment(text).format(MOMENT_FORMAT.FULL_DATE_FORMAT)
            : '--';
        },
      },
      {
        title: t('common.actions'),
        dataIndex: 'actions',
        key: 'actions',
        width: 100,
        render: (_, record: ISurvey) => (
          <div
            className="flex-center actions"
            onClick={e => e.stopPropagation()}
          >
            <SurveyDropDownMenu record={record} />
          </div>
        ),
      },
    ],
    [t],
  );

  const onRow = useMemo(
    () =>
      qsParams.isDeleted === 'true'
        ? undefined
        : record => {
            return {
              onClick: () =>
                navigate(
                  generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
                    projectId: params?.projectId,
                    surveyId: record.id,
                  }) + `?version=${record.latestVersion.displayId}`,
                ),
            };
          },
    [navigate, params?.projectId, qsParams.isDeleted],
  );

  const wrapperRef = useRef<any>();

  return (
    <SurveyWrapper className="flex-column" centerLastChild>
      <ProjectHeader routes={routes} search />

      <TableWrapper className="flex-column" ref={wrapperRef}>
        <HannahCustomSpin
          parentRef={wrapperRef}
          spinning={
            getSurveyListQuery.isLoading || getSurveyListQuery.isFetching
          }
        />
        <SimpleBar className={'TableWrapper__body'}>
          <Table
            dataSource={surveys}
            columns={columns}
            onRow={onRow}
            pagination={false}
            rowKey={record => record.id as string}
            scroll={{ x: 800 }}
          />
        </SimpleBar>
        <StyledPagination
          onChange={(page, pageSize) => {
            handleNavigate({ page, take: pageSize });
          }}
          showSizeChanger
          pageSize={formatQsParams.take}
          total={total}
          current={formatQsParams.page}
        />
      </TableWrapper>
    </SurveyWrapper>
  );
}

export default Survey;
