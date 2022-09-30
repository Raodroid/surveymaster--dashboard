import { Table } from 'antd';
import React from 'react';
import { QuestionListWrapper } from './styles';

const dataSource = [
  {
    key: '1',
    id: '113-8392',
    question: 'What is your age?',
    category: 'XXX-XXXX',
    subCategory: 'XXX-XXXX',
    variableName: 'YY-YY-YYY',
    type: 'Radio Buttons',
  },
  {
    key: '2',
    id: '113-8392',
    question: 'What is your age?',
    category: 'XXX-XXXX',
    subCategory: 'XXX-XXXX',
    variableName: 'YY-YY-YYY',
    type: 'Radio Buttons',
  },
];

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Question',
    dataIndex: 'question',
    key: 'question',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Sub Category',
    dataIndex: 'subCategory',
    key: 'subCategory',
  },
  {
    title: 'Variable Name',
    dataIndex: 'variableName',
    key: 'variableName',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
];

function QuestionList() {
  return (
    <QuestionListWrapper>
      <div className="title">Survey Questions List:</div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </QuestionListWrapper>
  );
}

export default QuestionList;
