import {FC} from 'react';
import {QuestionBlockProps} from '../type';
import SurveyQuestions from '@pages/Survey/components/SurveyQuestion/SurveyQuestions';

const Block: FC<QuestionBlockProps> = props => {
  const { fieldName } = props;

  return <SurveyQuestions fieldName={fieldName} />;
};

export default Block;
