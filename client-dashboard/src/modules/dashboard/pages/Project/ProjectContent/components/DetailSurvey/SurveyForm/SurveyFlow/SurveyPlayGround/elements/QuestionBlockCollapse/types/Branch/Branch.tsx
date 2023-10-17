import React, { FC } from 'react';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import { useTranslation } from 'react-i18next';

const Branch: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName } = props;
  return <div>Branch</div>;
};

export default Branch;
