import React, { FC, useCallback, useMemo } from 'react';
import { CategoryDetailWrapper } from './style';
import CategoryDetailHeader from './CategoryDetailHeader';
import { Menu, notification, Table } from 'antd';
import { GetListQuestionDto, IQuestion } from 'type';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import ThreeDotsDropdown from '../../../../../customize-components/ThreeDotsDropdown';
import useParseQueryString from '../../../../../hooks/useParseQueryString';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { onError } from '../../../../../utils';
import { QuestionBankService } from '../../../../../services';
import _get from 'lodash/get';

enum ACTION_ENUM {
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
}

const CategoryDetail = () => {
  const { t } = useTranslation();
  const params = useParseQueryString<{
    category?: string;
    subCategory?: string;
  }>();

  const { category, subCategory } = params;

  const baseParams: GetListQuestionDto = useMemo<GetListQuestionDto>(() => {
    return {
      take: 10,
      page: 1,
      subCategoryIds: subCategory ? [subCategory] : undefined,
      categoryIds: category ? [category] : undefined,
    };
  }, [category, subCategory]);

  const getQuestionListQuery = useQuery(
    ['getQuestionList'],
    () => {
      return QuestionBankService.getQuestions(baseParams);
    },
    {
      onError,
    },
  );

  const questionList = useMemo<IQuestion[]>(
    () => _get(getQuestionListQuery.data, 'data.data'),
    [getQuestionListQuery.data],
  );

  const columns = useMemo<ColumnsType<IQuestion>>(
    () => [
      {
        title: 'ID',
        dataIndex: ['latestVersion', 'id'],
      },
      {
        title: t('common.question'),
        dataIndex: ['latestVersion', 'question'],
        render: value => value?.title || '--',
      },
      {
        title: t('common.category'),
        dataIndex: ['masterCategory', 'name'],
      },
      {
        title: t('common.subCategory'),
        dataIndex: ['masterSubCategory', 'name'],
      },
      {
        title: t('common.variableName'),
        dataIndex: 'masterVariableName',
      },
      {
        title: t('common.answerType'),
        dataIndex: ['latestVersion', 'question', 'type'],
        render: value => value || '--',
      },
      {
        title: t('common.action'),
        dataIndex: 'id',
        render: (value, _) => <DropDownMenu record={_} />,
      },
    ],
    [t],
  );

  return (
    <CategoryDetailWrapper>
      <CategoryDetailHeader />
      <div className={'CategoryDetail__body'}>
        <Table dataSource={questionList} columns={columns} />
      </div>
    </CategoryDetailWrapper>
  );
};

export default CategoryDetail;

interface IDropDownMenu {
  record: IQuestion;
}

const DropDownMenu: FC<IDropDownMenu> = props => {
  const { record } = props;
  const isDeleted = record?.deletedAt;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.deleteQuestionByQuestionId(data);
    },
    {
      onSuccess: async () => {
        // await queryClient.invalidateQueries('getProjects');
        notification.success({ message: t('common.deleteSuccess') });
      },
      onError,
    },
  );

  const restoreMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.restoreQuestionByQuestionId(data);
    },
    {
      onSuccess: async () => {
        // await queryClient.invalidateQueries('getProjects');
        notification.success({ message: t('common.restoreSuccess') });
      },
      onError,
    },
  );

  const handleSelect = useCallback(
    async (props: {
      record: IQuestion;
      selectedKeys: string[];
      key: string;
      keyPath: string[];
      item: React.ReactInstance;
    }) => {
      const { key, record } = props;
      switch (key) {
        case ACTION_ENUM.DELETE: {
          await deleteMutation.mutateAsync({ id: record.id as string });
          return;
        }
        case ACTION_ENUM.RESTORE: {
          await restoreMutation.mutateAsync({ id: record.id as string });
          return;
        }
      }
    },
    [deleteMutation, restoreMutation],
  );
  return (
    <ThreeDotsDropdown
      overlay={
        <Menu
          onSelect={input => {
            handleSelect({ ...input, record });
          }}
        >
          {isDeleted && (
            <Menu.Item key={ACTION_ENUM.RESTORE} icon={<EditOutlined />}>
              {t('common.restore')}
            </Menu.Item>
          )}
          {!isDeleted && (
            <Menu.Item key={ACTION_ENUM.DELETE} icon={<DeleteOutlined />}>
              {t('common.delete')}
            </Menu.Item>
          )}
        </Menu>
      }
      placement="bottomLeft"
      trigger={'click' as any}
    />
  );
};
