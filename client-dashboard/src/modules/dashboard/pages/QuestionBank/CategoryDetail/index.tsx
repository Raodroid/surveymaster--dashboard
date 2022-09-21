import React, { useMemo } from 'react';
import { CategoryDetailWrapper } from './style';
import CategoryDetailHeader from './CategoryDetailHeader';
import { Table } from 'antd';
import { IQuestion, mockQuestionList } from 'type';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import ThreeDotsDropdown from '../../../../../customize-components/ThreeDotsDropdown';
import useParseQueryString from '../../../../../hooks/useParseQueryString';

const questionList = mockQuestionList.data;

const CategoryDetail = () => {
  const { t } = useTranslation();
  const params = useParseQueryString<{ categoryId?: string }>();

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
        render: (value, _) => {
          return (
            <ThreeDotsDropdown overlay={<div>hi</div>} trigger={['click']} />
          );
        },
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
