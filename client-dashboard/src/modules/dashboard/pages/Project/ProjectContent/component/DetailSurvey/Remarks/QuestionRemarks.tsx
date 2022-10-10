import { Table } from 'antd';
import React from 'react';
import Remark from './Remark';
import { QuestionRemarksWrapper } from './styles';

const columns = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'remark',
    render: (_, record: any, index: number) => <Remark index={index} />,
  },
];

function QuestionRemarks(props: { questions: any }) {
  const { questions } = props;
  return (
    <QuestionRemarksWrapper>
      <div className="title">Question Remarks</div>
      <Table
        dataSource={questions}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    </QuestionRemarksWrapper>
  );
}

export default QuestionRemarks;
