import { SurveyPlayGroundWrapper } from './style';
import AddNewBlockElement from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/AddNewBlockElement/AddNewBlockElement';
import SurveyTree from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyTree/SurveyTree';

const SurveyPlayGround = () => {
  return (
    <SurveyPlayGroundWrapper>
      <SurveyTree />
      <AddNewBlockElement fieldName={'version.surveyFlowElements'} />
    </SurveyPlayGroundWrapper>
  );
};

export default SurveyPlayGround;
