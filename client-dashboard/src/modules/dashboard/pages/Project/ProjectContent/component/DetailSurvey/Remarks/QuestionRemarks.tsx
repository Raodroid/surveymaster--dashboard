import { Table } from 'antd';
import React from 'react';
import Remark from './Remark';
import { QuestionRemarksWrapper } from './styles';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'remark',
    render: (_, record: any, index: number) => <Remark index={index} />,
  },
];

function QuestionRemarks() {
  return (
    <QuestionRemarksWrapper>
      <div className="title">Question Remarks</div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    </QuestionRemarksWrapper>
  );
}

export default QuestionRemarks;
