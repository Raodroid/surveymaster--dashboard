import { SurveyFlowElements } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyForm';
import { QuestionType, SubSurveyFlowElement } from '@/type';
import { FC } from 'react';
import {
  RadioButton,
  MultipleChoice,
  Photo,
  DataMatrix,
  TextEntry,
  Signature,
  Slider,
  TimePicker,
  DatePicker,
  FormField,
  TextGraphic,
} from './Content';

export const getQuestionFromAllBlocks = (
  input: SurveyFlowElements[] = [],
  resultArr,
) => {
  input.forEach(flow => {
    const { surveyQuestions, blockId, blockDescription, type, children } = flow;
    if (type === SubSurveyFlowElement.BLOCK) {
      resultArr.push({
        label: blockDescription,
        options: (surveyQuestions || []).map(i => ({
          label: i?.questionTitle || '',
          value: `${blockId}*${i.questionVersionId}`,
        })),
      });
    }

    if (type === SubSurveyFlowElement.BRANCH) {
      getQuestionFromAllBlocks(children, resultArr);
    }
  });
};
export const questionChoiceMap: Record<QuestionType, FC> = {
  [QuestionType.RADIO_BUTTONS]: RadioButton,
  [QuestionType.MULTIPLE_CHOICE]: MultipleChoice,
  [QuestionType.PHOTO]: Photo,
  [QuestionType.DATA_MATRIX]: DataMatrix,
  [QuestionType.TEXT_ENTRY]: TextEntry,
  [QuestionType.SIGNATURE]: Signature,
  [QuestionType.DATE_PICKER]: DatePicker,
  [QuestionType.FORM_FIELD]: FormField,
  [QuestionType.TEXT_GRAPHIC]: TextGraphic,
  [QuestionType.SLIDER]: Slider,
  [QuestionType.TIME_PICKER]: TimePicker,
};
