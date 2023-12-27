import {
  BranchChoiceType,
  IOptionGroupItem,
  LogicOperator,
  QuestionType,
  SubSurveyFlowElement,
} from '@/type';
import { FC } from 'react';
import {
  DataMatrix,
  DatePicker,
  FormField,
  MultipleChoice,
  Photo,
  RadioButton,
  Signature,
  Slider,
  TextEntry,
  TextGraphic,
  TimePicker,
} from './Content';
import { SurveyDataTreeNode } from '@pages/Survey/SurveyForm/type';
import { IQuestionChoiceComponent } from './type';

export const block_qVersionId_template = (input: {
  blockSort: number | undefined;
  questionVersionId: string | undefined;
  // optionSort: number | undefined;
}): string => {
  const { blockSort, questionVersionId } = input;
  return `${blockSort}*${questionVersionId}`;
};

export const gen_row_column_BranchChoiceType = (input: {
  rowIndex?: number;
  colIndex?: number;
  BranchChoiceType: BranchChoiceType;
}): string => {
  const { rowIndex, colIndex, BranchChoiceType } = input;

  return `${rowIndex}*${colIndex}*${BranchChoiceType}`;
};

// export const

export const gen_QID_template = (input: {
  blockSort: number;
  sort: number;
}) => {
  const { blockSort, sort } = input;
  return `QID${blockSort}${sort}`;
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
          disabled: !i.type
            ? false
            : [
                QuestionType.PHOTO,
                QuestionType.TEXT_GRAPHIC,
                QuestionType.SIGNATURE,
              ].includes(i.type as QuestionType),
          value: block_qVersionId_template({
            blockSort,
            questionVersionId: i.questionVersionId,
            // optionSort: [
            //   QuestionType.MULTIPLE_CHOICE,
            //   QuestionType.RADIO_BUTTONS,
            // ].includes(i.type as QuestionType)
            //   ? i.sort
            //   : undefined,
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
  [QuestionType.FORM_FIELD]: LogicOperator.EQUAL_TO,
  [QuestionType.TEXT_GRAPHIC]: LogicOperator.EQUAL_TO,
  [QuestionType.SLIDER]: LogicOperator.EQUAL_TO,
  [QuestionType.TIME_PICKER]: LogicOperator.EQUAL_TO,
  [QuestionType.DATE_PICKER]: LogicOperator.EQUAL_TO,
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
