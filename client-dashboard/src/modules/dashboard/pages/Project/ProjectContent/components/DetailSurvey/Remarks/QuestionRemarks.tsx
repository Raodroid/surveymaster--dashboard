import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { IQuestion } from 'type';
import Remark from './Remark';
import { QuestionRemarksWrapper } from './styles';

const columns: ColumnsType<IQuestion> = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'id',
    render: (_, record: IQuestion, index: number) => <Remark index={index} />,
  },
];

function QuestionRemarks(props: { questions: IQuestion[] }) {
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
        rowKey="id"
      />
    </QuestionRemarksWrapper>
  );
}

export default QuestionRemarks;
