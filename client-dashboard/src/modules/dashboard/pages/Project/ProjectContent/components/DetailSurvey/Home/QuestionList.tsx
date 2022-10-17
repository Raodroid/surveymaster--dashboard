import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { ISurveyQuestionRemark } from '../Remarks/QuestionRemarks';
import { QuestionListWrapper } from './styles';

interface IQuestion {
  id: string;
  questionVersionId: string;
  surveyId: string;
  sort: number;
  questionVersion: { title: string; question: ISurveyQuestionRemark };
}

const columns: ColumnsType<IQuestion> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (_, record: IQuestion) => (
      <div>{record?.questionVersion.question.displayId}</div>
    ),
  },
  {
    title: 'Question',
    dataIndex: 'question',
    key: 'question',
    render: (_, record: IQuestion) => (
      <div>{record?.questionVersion.title}</div>
    ),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (_, record: IQuestion) => (
      <div>{record?.questionVersion.question.masterCategory?.name}</div>
    ),
  },
  {
    title: 'Sub Category',
    dataIndex: 'subCategory',
    key: 'subCategory',
    render: (_, record: IQuestion) => (
      <div>{record?.questionVersion.question.masterSubCategory?.name}</div>
    ),
  },
  {
    title: 'Variable Name',
    dataIndex: 'variableName',
    key: 'variableName',
    render: (_, record: IQuestion) => (
      <div>{record?.questionVersion.question.masterVariableName}</div>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (_, record: IQuestion) => (
      <div>{record?.questionVersion.question?.type}</div>
    ),
  },
];

function QuestionList(props: { questions: IQuestion[] }) {
  const { questions } = props;
  const { t } = useTranslation();

  return (
    <QuestionListWrapper>
      <div className="title">{t('common.surveyQuestionsList')}:</div>
      <Table dataSource={questions} columns={columns} pagination={false} />
    </QuestionListWrapper>
  );
}

export default QuestionList;
