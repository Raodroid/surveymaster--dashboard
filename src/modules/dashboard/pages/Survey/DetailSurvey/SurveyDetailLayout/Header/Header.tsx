import { useCheckSurveyFormMode } from '@pages/Survey';
import EditSurveyHeader from './components/EditSurveyHeader';
import ViewModeHeader from './components/ViewModeHeader';
import { memo } from 'react';

const Header = () => {
  const { isViewMode } = useCheckSurveyFormMode();

  return isViewMode ? <ViewModeHeader /> : <EditSurveyHeader />;
};

export default memo(Header);
