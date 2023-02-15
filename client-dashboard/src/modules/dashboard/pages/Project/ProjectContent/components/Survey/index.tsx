import { ExportOutlined } from '@ant-design/icons';
import { Modal, notification, Table } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ColumnsType } from 'antd/lib/table';
import { MenuDropDownWrapper } from 'customize-components/styles';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { MOMENT_FORMAT, SCOPE_CONFIG } from 'enums';
import useHandleNavigate from 'hooks/useHandleNavigate';
import useParseQueryString from 'hooks/useParseQueryString';
import {
  FileIconOutlined,
  PenFilled,
  RollbackOutlined,
  TrashOutlined,
} from 'icons';
import _get from 'lodash/get';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import StyledPagination from 'modules/dashboard/components/StyledPagination';
import moment from 'moment';
import React, { FC, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import { ProjectService, SurveyService } from 'services';
import SimpleBar from 'simplebar-react';
import { IGetParams, IPostSurveyBodyDto, ISurvey, ProjectTypes } from 'type';
import { onError, saveBlob } from 'utils';
import { useCheckScopeEntityDefault } from '../../../../../../common/hoc';
import HannahCustomSpin from '../../../../../components/HannahCustomSpin';
import { projectRoutePath, useGetProjectByIdQuery } from '../../../util';
import ProjectHeader from '../Header';
import { QsParams } from '../ProjectFilter';
import { SurveyWrapper, TableWrapper } from './style';
const { confirm } = Modal;
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
            <DropDownMenu record={record} />
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
interface IDropDownMenu {
  record: ISurvey;
}

enum ACTION_ENUM {
  DUPLICATE_SURVEY = 'DUPLICATE_SURVEY',
  RESTORE = 'RESTORE',
  EDIT = 'EDIT',
  EXPORT = 'EXPORT',
  DELETE = 'DELETE',
}

const DropDownMenu: FC<IDropDownMenu> = props => {
  const { record } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ projectId?: string }>();
  const { project, isLoading: isFetchingProject } = useGetProjectByIdQuery(
    params?.projectId,
  );
  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const { canUpdate, canRead, canDelete } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTIONS,
  );

  const duplicateMutation = useMutation(
    (data: IPostSurveyBodyDto & { surveyId: string }) => {
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
    () => SurveyService.deleteSurveyById({ id: record.id as string }),
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
    () => SurveyService.restoreSurveyById({ id: record.id as string }),
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

  const items = useMemo(() => {
    if (isFetchingProject) return [];
    const baseMenu: ItemType[] = [];

    if (canUpdate) {
      baseMenu.push({
        icon: <PenFilled />,
        label: t('common.editSurvey'),
        key: ACTION_ENUM.EDIT,
      });
      baseMenu.push({
        icon: <FileIconOutlined />,
        label: t('common.duplicateSurvey'),
        key: ACTION_ENUM.DUPLICATE_SURVEY,
      });
      if (record.deletedAt) {
        baseMenu.push({
          icon: <RollbackOutlined />,
          label: t('common.restoreSurvey'),
          key: ACTION_ENUM.RESTORE,
        });
      }
    }

    if (!isExternalProject && canRead) {
      baseMenu.push({
        icon: <ExportOutlined />,
        label: t('common.exportQualtricsJSON'),
        key: ACTION_ENUM.EXPORT,
      });
    }
    if (canDelete && !record.deletedAt) {
      baseMenu.push({
        icon: <TrashOutlined />,
        label: t('common.deleteSurvey'),
        key: ACTION_ENUM.DELETE,
      });
    }

    return baseMenu;
  }, [
    canDelete,
    canRead,
    canUpdate,
    isExternalProject,
    isFetchingProject,
    record.deletedAt,
    t,
  ]);

  const handleExport = useCallback(async () => {
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
  }, [record.latestVersion?.id]);

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
          await duplicateMutation.mutateAsync({
            version: {
              name: `${record?.latestVersion?.name} (Copy)`,
            },
            projectId: params.projectId as string,
            surveyId: record.id as string,
          });
          return;
        }
        case ACTION_ENUM.EDIT: {
          if (!params?.projectId) return;
          navigate(
            generatePath(projectRoutePath.DETAIL_SURVEY.EDIT, {
              projectId: params?.projectId,
              surveyId: record.id,
            }) + `?version=${record?.latestVersion?.displayId}`,
          );
          return;
        }
        case ACTION_ENUM.EXPORT: {
          await handleExport();
          return;
        }
        case ACTION_ENUM.DELETE: {
          confirm({
            icon: null,
            content: t('common.confirmDeleteSurvey'),
            onOk() {
              deleteSurvey.mutateAsync();
            },
          });
          return;
        }
        case ACTION_ENUM.RESTORE: {
          confirm({
            icon: null,
            content: t('common.confirmRestoreSurvey'),
            onOk() {
              restoreSurvey.mutateAsync();
            },
          });

          return;
        }
      }
    },
    [
      deleteSurvey,
      duplicateMutation,
      handleExport,
      navigate,
      params.projectId,
      restoreSurvey,
      t,
    ],
  );

  const menu = (
    <MenuDropDownWrapper
      onClick={input => {
        handleSelect({ ...input, record }).then();
      }}
      items={items}
    />
  );

  if (items.length === 0) return null;

  return (
    <ThreeDotsDropdown
      overlay={menu}
      placement="bottomLeft"
      trigger={'click' as any}
    />
  );
};
