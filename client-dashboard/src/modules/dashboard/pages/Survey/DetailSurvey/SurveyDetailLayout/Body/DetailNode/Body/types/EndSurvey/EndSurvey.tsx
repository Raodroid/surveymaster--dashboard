import React, { FC } from 'react';
import { QuestionBlockProps } from '@pages/Survey/components/QuestionBlock/types/type';
import { useTranslation } from 'react-i18next';

const EndSurvey: FC<QuestionBlockProps> = () => {
  const { t } = useTranslation();
  return t('common.EndSurvey');
};

export default EndSurvey;
