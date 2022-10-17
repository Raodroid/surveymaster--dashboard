import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { UserPayload } from 'redux/user';
import { IQuestionCategory, IQuestionVersion } from 'type';
import Remark from './Remark';
import { QuestionRemarksWrapper } from './styles';

export interface ISurveyQuestionRemark {
  id: string;
  displayId: string;
  latestCompletedVersion: IQuestionVersion;
  latestVersion: IQuestionVersion;
  versions: [IQuestionVersion, IQuestionVersion];
  masterCategoryId: string;
  masterCategory: IQuestionCategory;
  masterSubCategoryId: string;
  masterSubCategory: IQuestionCategory;
  masterVariableName: string;
  masterCombineTokenString: string;
  createdBy: UserPayload;
  createdAt: Date;
  type: string;
}

const columns: ColumnsType<ISurveyQuestionRemark> = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'remark',
    render: (_, record: ISurveyQuestionRemark, index: number) => (
      <Remark index={index} />
    ),
  },
];

function QuestionRemarks(props: { questions: ISurveyQuestionRemark[] }) {
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
