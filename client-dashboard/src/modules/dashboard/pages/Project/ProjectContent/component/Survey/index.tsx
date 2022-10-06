import { Menu, notification, Table } from 'antd';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { CloseIcon, PenFilled, TrashOutlined } from 'icons';
import React, { FC, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProjectTableWrapper } from '../../style';
import ProjectHeader from '../Header';
import { SurveyWrapper } from './style';
import {
  IProject,
  IQuestion,
  ISurvey,
  mockSurveyList,
} from '../../../../../../../type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import {
  QuestionBankService,
  SurveyService,
} from '../../../../../../../services';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { onError } from '../../../../../../../utils';

function Survey() {
  const params = useParams<{ id?: string }>();
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
        width: 300,
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
        width: 30,
        render: (_, record: any) => (
          <div
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <DropDownMenu record={record} />
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
          // scroll={{ x: 1500 }}
        />
      </ProjectTableWrapper>
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
