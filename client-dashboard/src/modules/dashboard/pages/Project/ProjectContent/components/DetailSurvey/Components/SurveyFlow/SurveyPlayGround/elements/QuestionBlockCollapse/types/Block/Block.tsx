import React, { FC } from 'react';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import SurveyQuestions from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/SurveyQuestion/SurveyQuestions';

const Block: FC<QuestionBlockProps> = props => {
  const { fieldName } = props;

  return <SurveyQuestions fieldName={fieldName} />;
};

export default Block;
