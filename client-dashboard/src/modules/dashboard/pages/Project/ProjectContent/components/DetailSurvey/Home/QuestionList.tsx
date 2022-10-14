import { Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { mockSurveyDetail } from 'type';
import { QuestionListWrapper } from './styles';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (_, record: any) => (
      <div>{record.questionVersion.question.displayId}</div>
    ),
  },
  {
    title: 'Question',
    dataIndex: 'question',
    key: 'question',
    render: (_, record: any) => <div>{record.questionVersion.title}</div>,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (_, record: any) => (
      <div>{record.questionVersion.question.masterCategory.name}</div>
    ),
  },
  {
    title: 'Sub Category',
    dataIndex: 'subCategory',
    key: 'subCategory',
    render: () => <div>XXX-XXXX</div>,
  },
  {
    title: 'Variable Name',
    dataIndex: 'variableName',
    key: 'variableName',
    render: (_, record: any) => (
      <div>{record.questionVersion.question.masterVariableName}</div>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: () => <div>Radio Buttons</div>,
  },
];

function QuestionList(props: { survey: any }) {
  const { survey } = props;
  const { t } = useTranslation();
  return (
    <QuestionListWrapper>
      <div className="title">{t('common.surveyQuestionsList')}:</div>
      <Table dataSource={survey} columns={columns} pagination={false} />
    </QuestionListWrapper>
  );
}

export default QuestionList;
