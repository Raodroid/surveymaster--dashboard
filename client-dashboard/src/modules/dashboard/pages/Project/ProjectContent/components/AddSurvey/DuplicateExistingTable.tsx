import { Table } from 'antd';
import React from 'react';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Title',
    dataIndex: 'title',
  },
  {
    title: 'N of Q.',
    dataIndex: 'NOfQ',
  },

  {
    title: 'Category',
    dataIndex: 'category',
  },
  {
    title: 'Sub Category',
    dataIndex: 'subCategory',
  },
];

const data = [
  {
    key: '1',
    id: '113-8392',
    title: 'Onboarding Survey',
    NOfQ: '23',
    category: 'Demographics',
    subCategory: 'XXX-XXX',
  },
  {
    key: '2',
    id: '113-9023',
    title: 'Health Survey',
    NOfQ: '48',
    category: 'Healthcare',
    subCategory: 'XXX-XXX',
  },
  {
    key: '3',
    id: '113-2121',
    title: 'Month Survey',
    NOfQ: '10',
    category: 'Customer Feed…',
    subCategory: 'XXX-XXX',
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
  getCheckboxProps: (record: any) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

function DuplicateExistingTable() {
  return (
    <Table
      rowSelection={{
        ...rowSelection,
      }}
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}

export default DuplicateExistingTable;
