import {
  ExtraSurveyFlowElement,
  IAddSurveyFormValues,
} from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyForm';
import { ISurveyVersionBaseDto, SubSurveyFlowElementDto } from '@/type';

const transSurveyFLowElement = (
  input: ExtraSurveyFlowElement[] | SubSurveyFlowElementDto[],
): SubSurveyFlowElementDto[] => {
  return input.map((i, idx) => {
    return {
      type: i.type,
      sort: idx,
      blockDescription: i.blockDescription,
      surveyQuestions: i.surveyQuestions,
      branchLogics: i.branchLogics,
      listEmbeddedData: i.listEmbeddedData,
      children: transSurveyFLowElement(i?.children || []),
    };
  });
};

export const transformSurveyVersion = (
  values: IAddSurveyFormValues,
): ISurveyVersionBaseDto => {
  const surveyFlowElements: SubSurveyFlowElementDto[] = transSurveyFLowElement(
    values.version?.surveyFlowElements || [],
  );

  return { ...values.version, surveyFlowElements };
};
