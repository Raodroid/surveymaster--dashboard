import { useContext } from 'react';
import { SurveyFormContext } from '@pages/Survey';

export const useSurveyFormContext = () => {
  return useContext(SurveyFormContext);
};
