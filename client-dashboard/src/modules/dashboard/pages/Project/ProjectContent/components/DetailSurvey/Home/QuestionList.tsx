import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import useParseQueryString from 'hooks/useParseQueryString';
import moment from 'moment';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IQuestion, IQuestionVersion } from 'type';
import ProjectFilter, { QsParams } from '../../ProjectFilter';
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
    dataIndex: ['questionVersion', 'type'],
    key: 'type',
    render: (type: string) => <Type type={type} />,
  },
];

function QuestionList(props: { questions: IDetailSurveyQuestion[] }) {
  const { questions: questionData } = props;
  const QsParams = useParseQueryString<QsParams>();
  const { t } = useTranslation();
  const questions = useMemo(() => {
    return (questionData || []).sort((q1, q2) => q1.sort - q2.sort);
  }, [questionData]);

  const questionsFiltered = useMemo(() => {
    if (!questions) return [];
    const result = questions
      .filter(elm =>
        QsParams.isDeleted === 'true' ? elm.deletedAt : !elm.deletedAt,
      )
      .filter(elm => {
        const createdFrom = QsParams.createdFrom ?? '';
        return createdFrom !== ''
          ? moment(QsParams.createdFrom)
              .startOf('day')
              .isSameOrBefore(moment(elm.createdAt))
          : elm;
      })
      .filter(elm => {
        const createdTo = QsParams.createdTo ?? '';
        return createdTo !== ''
          ? moment(QsParams.createdTo)
              .endOf('day')
              .isSameOrAfter(moment(elm.createdAt))
          : elm;
      });

    return result;
  }, [QsParams, questions]);

  return (
    <QuestionListWrapper>
      <div className="flex-center-between title-wrapper">
        <div className="title">{t('common.surveyQuestionsList')}:</div>
        <ProjectFilter />
      </div>
      <Table
        dataSource={questionsFiltered}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSizeOptions: [10, 20, 30, 50],
          showSizeChanger: true,
          locale: { items_per_page: '' },
        }}
      />
    </QuestionListWrapper>
  );
}

export default QuestionList;

const Type = (props: { type: string }) => {
  const { t } = useTranslation();
  return <>{t(`questionType.${props.type}`)}</>;
};
