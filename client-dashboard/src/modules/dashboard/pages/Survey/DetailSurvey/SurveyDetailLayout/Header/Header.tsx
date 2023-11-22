import React from 'react';
import { useCheckSurveyFormMode } from '@pages/Survey';
import EditSurveyHeader from './components/EditSurveyHeader';
import ViewModeHeader from './components/ViewModeHeader';

const Header = () => {
  const { isViewMode } = useCheckSurveyFormMode();

  return isViewMode ? <ViewModeHeader /> : <EditSurveyHeader />;
};

export default Header;
