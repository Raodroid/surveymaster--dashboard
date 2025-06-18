import { FC } from 'react';
import { useField } from 'formik';
import { questionValueType } from '@pages/Survey';
import EmptyQuestion from '@pages/Survey/components/SurveyQuestion/EmptyQuestion';
import QuestionTable from '@pages/Survey/components/SurveyQuestion/QuestionTable/QuestionTable';

const SurveyQuestions: FC<{
  fieldName: string;
}> = props => {
  const { fieldName } = props;

  const [{ value }] = useField<questionValueType[]>(
    `${fieldName}.surveyQuestions`,
  );

  return value?.length ? (
    <QuestionTable fieldName={fieldName} />
  ) : (
    <EmptyQuestion fieldName={fieldName} />
  );
};

export default SurveyQuestions;
