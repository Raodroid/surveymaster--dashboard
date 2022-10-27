import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { ISurvey, ISurveyQuestion } from 'type';
import Remark from './Remark';
import { QuestionRemarksWrapper } from './styles';
import { useFormikContext } from 'formik';

const columns: ColumnsType<ISurveyQuestion> = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'remark',
    render: (_, record, index: number) => <Remark index={index} />,
  },
];

function QuestionRemarks() {
  const { values } = useFormikContext<ISurvey>();
  const { t } = useTranslation();
  return (
    <QuestionRemarksWrapper>
      <div className="title">{t('common.questionRemarks')}:</div>
      <Table
        dataSource={values?.questions}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    </QuestionRemarksWrapper>
  );
}

export default QuestionRemarks;
