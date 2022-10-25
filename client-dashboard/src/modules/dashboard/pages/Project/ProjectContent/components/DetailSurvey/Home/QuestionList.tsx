import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IQuestion, IQuestionVersion } from 'type';
import { QuestionListWrapper } from './styles';

interface IDetailSurveyQuestion extends IQuestion {
  questionVersionId: string;
  surveyId: string;
  sort: number;
  questionVersion: IQuestionVersion & {
    question: IQuestion & {
      type: string;
    };
  };
}

const columns: ColumnsType<IDetailSurveyQuestion> = [
  {
    title: 'ID',
    dataIndex: ['questionVersion', 'question', 'displayId'],
    key: 'id',
  },
  {
    title: 'Question',
    dataIndex: ['questionVersion', 'title'],
    key: 'question',
  },
  {
    title: 'Category',
    dataIndex: ['questionVersion', 'question', 'masterCategory', 'name'],
    key: 'category',
  },
  {
    title: 'Sub Category',
    dataIndex: ['questionVersion', 'question', 'masterSubCategory', 'name'],
    key: 'subCategory',
  },
  {
    title: 'Variable Name',
    dataIndex: ['questionVersion', 'question', 'masterVariableName'],
    key: 'variableName',
  },
  {
    title: 'Type',
    dataIndex: ['questionVersion', 'question', 'type'],
    key: 'type',
  },
];

function QuestionList(props: { questions: IDetailSurveyQuestion[] }) {
  const { questions: questionData } = props;
  const { t } = useTranslation();
  const questions = useMemo(() => {
    return (questionData || []).sort((q1, q2) => q1.sort - q2.sort);
  }, [questionData]);

  return (
    <QuestionListWrapper>
      <div className="title">{t('common.surveyQuestionsList')}:</div>
      <Table dataSource={questions} columns={columns} pagination={false} />
    </QuestionListWrapper>
  );
}

export default QuestionList;
