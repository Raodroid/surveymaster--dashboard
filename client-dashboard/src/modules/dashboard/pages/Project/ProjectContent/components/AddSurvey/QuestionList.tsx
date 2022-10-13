import { PauseOutlined } from '@ant-design/icons';
import { Button, Input, Radio, Select, Table } from 'antd';
import { TrashOutlined } from 'icons';
import { useMemo } from 'react';
import { TableWrapper } from '../Survey/style';
import { QuestionListWrapper } from './styles';

function QuestionList(props: { setFieldValue: any; values: any }) {
  const { values, setFieldValue } = props;

  const dataSource = useMemo(
    () => [
      {
        key: '1',
      },
      {
        key: '2',
      },
    ],
    [],
  );

  const columns = [
    {
      title: '',
      dataIndex: '',
      key: 'none',
      render: () => <PauseOutlined />,
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (_, record: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: () => (
        <Select
          defaultValue={'Select'}
          onChange={(e: any) => setFieldValue('question', e)}
        >
          <Select.Option value="gender">
            <Radio>What is your gender?</Radio>
          </Select.Option>
          <Select.Option value="age">
            <Radio>What is your age?</Radio>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Question Category',
      dataIndex: 'questionCategory',
      key: 'questionCategory',
      render: () => (
        <Select>
          <Select.Option value="a">Category A</Select.Option>
          <Select.Option value="b">Category B</Select.Option>
          <Select.Option value="c">Category C</Select.Option>
          <Select.Option value="d">Category D</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: () => (
        <Select showArrow={false} disabled>
          <Select.Option>Radio Button</Select.Option>
          <Select.Option>Radio Button</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (_, record: any, index: number) => <Input.TextArea />,
    },
    {
      title: '',
      dataIndex: 'remove',
      key: 'remove',
      render: () => (
        <Button>
          <TrashOutlined />
        </Button>
      ),
    },
  ];

  return (
    <QuestionListWrapper>
      <div className="title">Survey Question List:</div>

      <TableWrapper>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </TableWrapper>

      <div className="btn-wrapper flex">
        <Button>Add All Questions from One Category</Button>
        <Button
          type="primary"
          onClick={() => dataSource.push({ key: dataSource.length.toString() })}
        >
          Add One More Question
        </Button>
      </div>
    </QuestionListWrapper>
  );
}

export default QuestionList;
