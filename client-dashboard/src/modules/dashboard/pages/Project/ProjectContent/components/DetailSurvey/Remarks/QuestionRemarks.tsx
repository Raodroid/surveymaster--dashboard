import { Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <QuestionRemarksWrapper>
      <div className="title">{t('common.questionRemarks')}:</div>
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
