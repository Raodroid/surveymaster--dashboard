import { useContext } from 'react';
import { SurveyTreeContext } from '@pages/Survey';

export const useSurveyTreeContext = () => {
  return useContext(SurveyTreeContext);
};
