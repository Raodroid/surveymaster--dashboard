import { useContext } from 'react';
import { SurveyFormContext } from './SurveyFormContext';

export const useSurveyFormContext = () => {
  return useContext(SurveyFormContext);
};
