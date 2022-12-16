import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ISurveyQuestion, ISurveyVersion } from 'type';
import Remark from './Remark';
import { QuestionRemarksWrapper } from './styles';

const columns: ColumnsType<ISurveyQuestion> = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'id',
    render: (_, record: ISurveyQuestion, index: number) => (
      <Remark index={index} />
    ),
  },
];

function QuestionRemarks() {
  const { values } = useFormikContext<ISurveyVersion>();
  const { t } = useTranslation();
  return (
    <QuestionRemarksWrapper>
      <div className="title">{t('common.questionRemarks')}:</div>
      <Table
        dataSource={values?.questions}
        columns={columns}
        pagination={false}
        showHeader={false}
        rowKey="id"
      />
    </QuestionRemarksWrapper>
  );
}

export default QuestionRemarks;
