import { Modal, notification, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { MOMENT_FORMAT, ROUTE_PATH, SCOPE_CONFIG } from '@/enums';
import {
  keysAction,
  useHandleNavigate,
  useParseQueryString,
  useSelectTableRecord,
} from 'hooks';
import _get from 'lodash/get';

import { StyledPagination } from 'modules/dashboard';
import moment from 'moment';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import { ProjectService, SurveyService } from 'services';
import SimpleBar from 'simplebar-react';
import {
  ActionThreeDropDownType,
  CreateSurveyBodyDto,
  IGetParams,
  IMenuItem,
  ISurvey,
  ProjectTypes,
  QsParams,
} from '@/type';
import {
  ProjectBriefDetail,
  ProjectHeader,
  useGetProjectByIdQuery,
} from '@pages/Project';
import { IBreadcrumbItem, useCheckScopeEntityDefault } from '@/modules/common';
import {
  FileIconOutlined,
  PenFilled,
  RollbackOutlined,
  TrashOutlined,
} from '@/icons';
import { onError, saveBlob } from '@/utils';
import { ExportOutlined } from '@ant-design/icons';
import { ThreeDotsDropdown } from '@/customize-components';

const { confirm } = Modal;

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

function SurveyTable() {
  const params = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const qsParams = useParseQueryString<QsParams>();
  const { t } = useTranslation();
  const handleNavigate = useHandleNavigate(initParams);
  const queryClient = useQueryClient();

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
  const duplicateMutation = useMutation(
    (data: CreateSurveyBodyDto & { surveyId: string }) => {
      return SurveyService.duplicateSurvey(data as any);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        notification.success({ message: t('common.duplicateSuccess') });
      },
      onError,
    },
  );

  const deleteSurvey = useMutation(
    (record: ISurvey) =>
      SurveyService.deleteSurveyById({ id: record.id as string }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        notification.success({
          message: t('common.deleteSuccess'),
        });
      },
      onError,
    },
  );
  const restoreSurvey = useMutation(
    (record: ISurvey) =>
      SurveyService.restoreSurveyById({ id: record.id as string }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveys');
        notification.success({
          message: t('common.restoreSuccess'),
        });
      },
      onError,
    },
  );

  const handleDuplicateSurvey = useCallback(
    (record: ISurvey) => {
      duplicateMutation.mutateAsync({
        version: {
          name: `${record?.latestVersion?.name} (Copy)`,
        },
        projectId: params.projectId as string,
        surveyId: record.id as string,
      });
    },
    [duplicateMutation, params.projectId],
  );

  const handleEdit = useCallback(
    (record: ISurvey) => {
      navigate(
        generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT, {
          projectId: params?.projectId,
          surveyId: record.id,
        }) + `?version=${record?.latestVersion?.displayId}`,
      );
    },
    [navigate, params?.projectId],
  );
  const handleExport = useCallback(async (record: ISurvey) => {
    try {
      const response = await SurveyService.getSurveyFile(
        record.latestVersion?.id as string,
      );

      const data: {
        SurveyElements: any[];
        SurveyEntry: { SurveyName: string };
      } = _get(response, 'data', {});

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/octet-stream',
      });
      saveBlob(
        blob,
        `${data.SurveyEntry.SurveyName}-${moment().format(
          MOMENT_FORMAT.EXPORT,
        )}.qsf`,
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDelete = useCallback(
    (record: ISurvey) => {
      confirm({
        icon: null,
        content: t('common.confirmDeleteSurvey'),
        onOk() {
          deleteSurvey.mutateAsync(record);
        },
      });
    },
    [deleteSurvey, t],
  );
  const handleRestore = useCallback(
    (record: ISurvey) => {
      confirm({
        icon: null,
        content: t('common.confirmRestoreSurvey'),
        onOk() {
          restoreSurvey.mutateAsync(record);
        },
      });
    },
    [restoreSurvey, t],
  );

  const tableActions = useMemo<keysAction<ISurvey>>(
    () => [
      {
        key: ACTION.DUPLICATE_SURVEY,
        action: handleDuplicateSurvey,
      },
      {
        key: ACTION.EDIT,
        action: handleEdit,
      },
      {
        key: ACTION.EXPORT,
        action: handleExport,
      },
      {
        key: ACTION.DELETE,
        action: handleDelete,
      },
      {
        key: ACTION.RESTORE,
        action: handleRestore,
      },
    ],
    [
      handleDelete,
      handleDuplicateSurvey,
      handleEdit,
      handleExport,
      handleRestore,
    ],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<ISurvey>(tableActions);

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
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY,
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
            role="presentation"
            className="flex-center actions"
            onClick={e => e.stopPropagation()}
          >
            <ActionThreeDropDown record={record} handleSelect={handleSelect} />
          </div>
        ),
      },
    ],
    [handleSelect, t],
  );

  const onRow = useMemo(
    () =>
      qsParams.isDeleted === 'true'
        ? undefined
        : record => {
            return {
              onClick: () =>
                navigate(
                  generatePath(
                    ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
                    {
                      projectId: params?.projectId,
                      surveyId: record.id,
                    },
                  ) + `?version=${record.latestVersion.displayId}`,
                ),
            };
          },
    [navigate, params?.projectId, qsParams.isDeleted],
  );

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader
        showAddSurveyBtn
        showEditProjectBtn
        routes={routes}
        showSearch
      />
      <ProjectBriefDetail />

      <div className="h-full w-full p-2 relative overflow-hidden">
        <SimpleBar className={'h-full overflow-scroll'}>
          <Spin
            spinning={
              getSurveyListQuery.isLoading || getSurveyListQuery.isFetching
            }
          >
            <Table
              rowClassName={'pointer'}
              dataSource={surveys}
              columns={columns}
              onRow={onRow}
              pagination={false}
              rowKey={record => record.id as string}
              scroll={{ x: 800 }}
              className={'p-3'}
            />
          </Spin>
        </SimpleBar>
      </div>
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
}

export default SurveyTable;

const ACTION = {
  DUPLICATE_SURVEY: 'DUPLICATE_SURVEY',
  RESTORE: 'RESTORE',
  EDIT: 'EDIT',
  EXPORT: 'EXPORT',
  DELETE: 'DELETE',
} as const;

const ActionThreeDropDown: FC<ActionThreeDropDownType<ISurvey>> = props => {
  const { record, handleSelect } = props;
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string }>();

  const { project } = useGetProjectByIdQuery(params?.projectId);
  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const { canDelete, canRestore, canUpdate, canRead } =
    useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.QUESTION);

  const items = useMemo<IMenuItem[]>(() => {
    const baseMenu: IMenuItem[] = [];
    if (canUpdate) {
      baseMenu.push({
        icon: <PenFilled className={'text-primary'} />,
        label: t('common.editSurvey'),
        key: ACTION.EDIT,
      });
      baseMenu.push({
        icon: <FileIconOutlined className={'text-primary'} />,
        label: <label>{t('common.duplicateSurvey')}</label>,
        key: ACTION.DUPLICATE_SURVEY,
      });
      if (record.deletedAt && canRestore) {
        baseMenu.push({
          icon: <RollbackOutlined className={'text-primary'} />,
          label: t('common.restoreSurvey'),
          key: ACTION.RESTORE,
        });
      }
    }

    if (!isExternalProject && canRead) {
      baseMenu.push({
        icon: <ExportOutlined className={'text-primary'} />,
        label: t('common.exportQualtricsJSON'),
        key: ACTION.EXPORT,
      });
    }
    if (canDelete && !record.deletedAt) {
      baseMenu.push({
        icon: <TrashOutlined className={'text-primary'} />,
        label: t('common.deleteSurvey'),
        key: ACTION.DELETE,
      });
    }
    return baseMenu;
  }, [
    canDelete,
    canRead,
    canRestore,
    canUpdate,
    isExternalProject,
    record.deletedAt,
    t,
  ]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
    />
  );
};
