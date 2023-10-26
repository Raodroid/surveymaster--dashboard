import { IOptionGroupItem, QuestionType, SubSurveyFlowElement } from '@/type';
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
import { SurveyDataTreeNode } from '@pages/Survey/SurveyForm/type';
import { IQuestionChoiceComponent } from '@pages/Survey/components/QuestionBlock/types/Branch/QuestionChoice/type';

export const getQuestionFromAllBlocks = (
  input: SurveyDataTreeNode[] = [],
  resultArr: IOptionGroupItem[],
) => {
  input.forEach(flow => {
    const { surveyQuestions, blockSort, blockDescription, type, children } =
      flow;
    if (type === SubSurveyFlowElement.BLOCK) {
      resultArr.push({
        label: blockDescription,
        options: (surveyQuestions || []).map(i => ({
          label: i?.questionTitle || '',
          value: `${blockSort}*${i.questionVersionId}`,
        })),
      });
    }

    if (type === SubSurveyFlowElement.BRANCH) {
      getQuestionFromAllBlocks(children, resultArr);
    }
  });
};
export const questionChoiceMap: Record<
  QuestionType,
  FC<IQuestionChoiceComponent>
> = {
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
