import { Table } from 'antd';
import React from 'react';
import { QuestionListWrapper } from './styles';
import { mockSurveyDetail } from 'type';

const columns = [
  {
    title: 'ID',
    dataIndex: 'questionVersion',
    key: 'questionVersion',
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
    render: () => <div>XXX-XXXX</div>,
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
    render: () => <div>YY-YY-YYY</div>,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: () => <div>Radio Buttons</div>,
  },
];

function QuestionList(props: { survey: any }) {
  const { questions } = mockSurveyDetail;
  return (
    <QuestionListWrapper>
      <div className="title">Survey Questions List:</div>
      <Table dataSource={questions} columns={columns} pagination={false} />
    </QuestionListWrapper>
  );
}

export default QuestionList;
