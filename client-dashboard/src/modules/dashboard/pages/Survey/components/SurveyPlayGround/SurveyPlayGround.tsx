import { SurveyPlayGroundWrapper } from './style';
import AddNewBlockElement from '@pages/Survey/components/AddNewBlockElement/AddNewBlockElement';
import SurveyTree from '@pages/Survey/components/SurveyTree/SurveyTree';
import { rootSurveyFlowElementFieldName } from '@pages/Survey/SurveyForm/type';

const SurveyPlayGround = () => {
  return (
    <SurveyPlayGroundWrapper>
      <SurveyTree />
      <AddNewBlockElement fieldName={rootSurveyFlowElementFieldName} />
    </SurveyPlayGroundWrapper>
  );
};

export default SurveyPlayGround;
