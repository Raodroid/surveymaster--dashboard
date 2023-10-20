import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ISurveyQuestion, ISurveyVersion } from 'type';
import Remark from './Remark';
import { QuestionRemarksWrapper } from './styles';
import { useMemo } from 'react';

const columns: ColumnsType<ISurveyQuestion> = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'id',
    shouldCellUpdate: (record, prevRecord) => false,
    render: (_, record: ISurveyQuestion, index: number) => (
      <Remark index={index} />
    ),
  },
];

// const sortSurveyQuestion = (
//   input: ISurveyVersion['surveyFlowElements'],
// ): ISurveyVersion['surveyFlowElements'] => {
//
//
//
// };

function QuestionRemarks() {
  const { values } = useFormikContext<ISurveyVersion>();
  const { t } = useTranslation();
  return 'QuestionRemarks';

  // const dataSource = useMemo(
  //   () =>
  //     (values?.questions || [])?.sort(
  //       (a, b) => Number(a.sort) - Number(b.sort),
  //     ),
  //   [values?.questions],
  // );
  // return (
  //   <QuestionRemarksWrapper>
  //     <div className="title">{t('common.questionRemarks')}:</div>
  //     <Table
  //       dataSource={dataSource}
  //       columns={columns}
  //       pagination={false}
  //       showHeader={false}
  //       rowKey="id"
  //     />
  //   </QuestionRemarksWrapper>
  // );
}

export default QuestionRemarks;
