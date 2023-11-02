import React, { FC, useCallback, useMemo } from 'react';
import { BranchChoiceType, IOptionGroupItem, LogicOperator } from '@/type';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import {
  defaultChoiceType,
  defaultOperatorQuestion,
  questionChoiceMap,
} from './util';
import { useSurveyFormContext } from '@pages/Survey/components/SurveyFormContext';
import { ExtraSubBranchLogicDto } from '@pages/Survey/SurveyForm/type';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';

export interface IQuestionChoice {
  fieldName: string;
  index: number;
  options: IOptionGroupItem[];
}

const QuestionChoice: FC<IQuestionChoice> = props => {
  const { fieldName, index, options } = props;
  const { t } = useTranslation();
  const { question } = useSurveyFormContext();
  const { questionIdMap } = question;
  const { isViewMode } = useCheckSurveyFormMode();

  const [{ value }, , { setValue }] = useField<ExtraSubBranchLogicDto>(
    `${fieldName}[${index}]`,
  );
  const handleOnChange = useCallback(
    blockSort_qId_value => {
      const spitedValue = blockSort_qId_value.split('*');

      const blockSort = Number(spitedValue[0]);
      const qId = spitedValue[1];
      const optionSort = Number(spitedValue[2]);

      const selectedQuestion = questionIdMap[qId];
      if (!selectedQuestion) return;
      setValue({
        ...value,
        optionSort: optionSort === NaN ? undefined : optionSort,
        choiceType: selectedQuestion.type
          ? defaultChoiceType[selectedQuestion.type]
          : BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
        blockSort,
        blockSort_qId: blockSort_qId_value,
        questionVersionId: qId,
        leftOperand: '',
        rightOperand: '',
        questionType: selectedQuestion.type,
        operator: selectedQuestion.type
          ? defaultOperatorQuestion[selectedQuestion.type]
          : LogicOperator.EQUAL_TO,
      });
    },
    [questionIdMap, setValue, value],
  );

  const QuestionComponent = useMemo(() => {
    if (!value.questionVersionId) {
      return () => null;
    }
    const questionType = questionIdMap[value.questionVersionId]?.type;
    return questionType ? questionChoiceMap[questionType] : () => null;
  }, [questionIdMap, value.questionVersionId]);

  return (
    <>
      <ControlledInput
        className={`min-w-[150px] ${isViewMode ? 'view-mode' : ''}`}
        value={value.questionVersionId}
        // onSearch={value => {
        //   setSearchTxt(value);
        // }}
        filterOption={false}
        options={options as any[]}
        placeholder={t('common.selectQuestion')}
        onChange={handleOnChange}
        name={`${fieldName}[${index}].blockSort_qId`}
        inputType={INPUT_TYPES.SELECT}
      />
      <QuestionComponent
        fieldName={`${fieldName}[${index}]`}
        questionData={
          value?.questionVersionId
            ? questionIdMap[value?.questionVersionId]
            : undefined
        }
      />
    </>
  );
};

export default QuestionChoice;
