import React, { FC, useCallback, useMemo } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { useField } from 'formik';
import { ExtraSubBranchLogicDto } from '@pages/Survey/SurveyForm/type';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import {
  BranchChoiceType,
  IOptionItem,
  LogicOperator,
  QuestionType,
} from '@/type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import LogicOperatorInput from './LogicOperatorInput';
import { gen_row_column_BranchChoiceType } from '../util';

const FormField: FC<IQuestionChoiceComponent> = props => {
  const { fieldName, questionData } = props;

  const [{ value }, , { setValue }] =
    useField<ExtraSubBranchLogicDto>(fieldName);

  const { isViewMode } = useCheckSurveyFormMode();

  const options = useMemo<IOptionItem[]>(() => {
    if (!questionData?.options) return [];

    const result: IOptionItem[] = [];

    questionData?.options.forEach(row => {
      const rowColumnOption: IOptionItem = {
        label: row.text as string,
        value: gen_row_column_BranchChoiceType({
          rowIndex: row.sort,
          BranchChoiceType: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
          colIndex: 1,
        }),
      };

      result.push(rowColumnOption);
    });

    return result;
  }, [questionData?.options]);

  const handleOnchange = useCallback(
    row_column_BranchChoiceType => {
      const spitedValue = row_column_BranchChoiceType.split('*');

      const row: number | '' = Number(spitedValue[0]);
      const col = Number(spitedValue[1]);

      setValue({
        ...value,
        row_column_BranchChoiceType,
        column: isNaN(col) ? undefined : col,
        row: isNaN(row) ? undefined : row,
        choiceType: BranchChoiceType.CHOICE_TEXT_ENTRY_VALUE,
        operator: LogicOperator.EQUAL_TO,
      });
    },
    [setValue, value],
  );

  const shouldRenderLogic = value.row_column_BranchChoiceType;

  return (
    <>
      <ControlledInput
        className={`w-[150px] ${isViewMode ? 'view-mode' : ''}`}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}.row_column_BranchChoiceType`}
        options={options}
        onChange={handleOnchange}
      />
      {shouldRenderLogic && (
        <div className={'flex items-center gap-3'}>
          <LogicOperatorInput
            fieldValue={value}
            fieldName={fieldName}
            type={QuestionType.FORM_FIELD}
          />
          <ControlledInput
            className={`w-[150px] ${isViewMode ? 'view-mode' : ''}`}
            inputType={INPUT_TYPES.INPUT}
            name={`${fieldName}.rightOperand`}
          />
        </div>
      )}
    </>
  );
};

export default FormField;
