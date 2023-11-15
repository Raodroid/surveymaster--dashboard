import React from 'react';
import { useCheckSurveyFormMode } from '@pages/Survey';
import CreateEditSurveyHeader from './components/CreateEditSurveyHeader';
import ViewModeHeader from './components/ViewModeHeader';

const Header = () => {
  const { isViewMode } = useCheckSurveyFormMode();

  return isViewMode ? <ViewModeHeader /> : <CreateEditSurveyHeader />;
};

export default Header;
