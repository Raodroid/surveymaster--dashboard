import {
  BranchChoiceType,
  IOptionGroupItem,
  LogicOperator,
  QuestionType,
  SubSurveyFlowElement,
} from '@/type';
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

export const block_qId_template = (input: {
  blockSort: number | undefined;
  questionVersionId: string | undefined;
  optionSort: number;
}): string => {
  const { blockSort, questionVersionId, optionSort } = input;
  return `${blockSort}*${questionVersionId}*${optionSort}`;
};

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
          value: block_qId_template({
            blockSort,
            questionVersionId: i.questionVersionId,
            optionSort: i.sort as number,
          }),
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

export const defaultOperatorQuestion: Record<QuestionType, LogicOperator> = {
  [QuestionType.RADIO_BUTTONS]: LogicOperator.SELECTED,
  [QuestionType.MULTIPLE_CHOICE]: LogicOperator.SELECTED,
  [QuestionType.PHOTO]: LogicOperator.NOT_EMPTY,
  [QuestionType.DATA_MATRIX]: LogicOperator.EQUAL_TO,
  [QuestionType.TEXT_ENTRY]: LogicOperator.EQUAL_TO,
  [QuestionType.SIGNATURE]: LogicOperator.EQUAL_TO,
  [QuestionType.DATE_PICKER]: LogicOperator.EQUAL_TO,
  [QuestionType.FORM_FIELD]: LogicOperator.EQUAL_TO,
  [QuestionType.TEXT_GRAPHIC]: LogicOperator.EQUAL_TO,
  [QuestionType.SLIDER]: LogicOperator.EQUAL_TO,
  [QuestionType.TIME_PICKER]: LogicOperator.EQUAL_TO,
};

export const defaultChoiceType: Record<QuestionType, BranchChoiceType> = {
  [QuestionType.RADIO_BUTTONS]: BranchChoiceType.SELECTABLE_CHOICE,
  [QuestionType.MULTIPLE_CHOICE]: BranchChoiceType.SELECTABLE_CHOICE,
  [QuestionType.TIME_PICKER]: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
  [QuestionType.DATA_MATRIX]: BranchChoiceType.SELECTABLE_CHOICE,

  [QuestionType.PHOTO]: BranchChoiceType.SELECTABLE_CHOICE,
  [QuestionType.TEXT_ENTRY]: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
  [QuestionType.SIGNATURE]: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
  [QuestionType.DATE_PICKER]: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
  [QuestionType.FORM_FIELD]: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
  [QuestionType.TEXT_GRAPHIC]: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
  [QuestionType.SLIDER]: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
};
