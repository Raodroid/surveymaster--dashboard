import React, { FC } from 'react';
import SurveyQuestions from '../../../SurveyQuestion/SurveyQuestions';
import { QuestionBlockProps } from '../type';

const Block: FC<QuestionBlockProps> = props => {
  const { fieldName } = props;

  return <SurveyQuestions fieldName={fieldName} />;
};

export default Block;
