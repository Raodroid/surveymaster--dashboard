import React, { FC, useCallback, useMemo } from 'react';
import { IQuestionChoiceComponent } from '../type';
import LogicOperatorInput from '@pages/Survey/components/QuestionBlock/types/Branch/QuestionChoice/Content/LogicOperatorInput';
import {
  BranchChoiceType,
  IOptionItem,
  LogicOperator,
  QuestionType,
} from '@/type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { useField } from 'formik';
import { ExtraSubBranchLogicDto } from '@pages/Survey/SurveyForm/type';
import { gen_row_column_BranchChoiceType } from '../util';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';

const DataMatrix: FC<IQuestionChoiceComponent> = props => {
  const { fieldName, questionData } = props;

  const [{ value }, , { setValue }] =
    useField<ExtraSubBranchLogicDto>(fieldName);

  const { isViewMode } = useCheckSurveyFormMode();

  const options = useMemo<IOptionItem[]>(() => {
    if (!questionData?.dataMatrix) return [];
    const { columns, rows } = questionData?.dataMatrix;

    let result: IOptionItem[] = [];

    rows.forEach((row, rowIndex) => {
      const rowCountOption: IOptionItem = {
        label: `${row.name} (Recode)`,
        value: gen_row_column_BranchChoiceType({
          rowIndex: rowIndex + 1,
          BranchChoiceType: BranchChoiceType.SELECTED_ANSWER_RECODE,
          colIndex: undefined,
        }),
      };

      result.push(rowCountOption);
      columns.forEach((col, colIndex) => {
        const rowColumnOption: IOptionItem = {
          label: `${row.name} - ${col.name}`,
          value: gen_row_column_BranchChoiceType({
            rowIndex: rowIndex + 1,
            BranchChoiceType: BranchChoiceType.SELECTABLE_CHOICE,
            colIndex: colIndex + 1,
          }),
        };

        result.push(rowColumnOption);
      });
    });

    for (let colIndex = columns.length - 1; colIndex >= 0; colIndex--) {
      const col = columns[colIndex];
      const columnOption: IOptionItem = {
        label: col.name,
        value: gen_row_column_BranchChoiceType({
          rowIndex: undefined,
          BranchChoiceType: BranchChoiceType.SELECTABLE_ANSWER,
          colIndex: colIndex + 1,
        }),
      };
      const columnCountOption: IOptionItem = {
        label: `${col.name} (Count)`,
        value: gen_row_column_BranchChoiceType({
          rowIndex: undefined,
          BranchChoiceType: BranchChoiceType.SELECTED_ANSWER_COUNT,
          colIndex: colIndex + 1,
        }),
      };
      result = [columnOption, columnCountOption, ...result];
    }
    return result;
  }, [questionData?.dataMatrix]);

  const handleOnchange = useCallback(
    row_column_BranchChoiceType => {
      const spitedValue = row_column_BranchChoiceType.split('*');

      const row: number | '' = Number(spitedValue[0]);
      const col = Number(spitedValue[1]);
      const branchChoiceType = spitedValue[2];

      const isSelectableValueOperator = [
        BranchChoiceType.SELECTABLE_CHOICE,
        BranchChoiceType.SELECTABLE_ANSWER,
      ].includes(branchChoiceType);

      setValue({
        ...value,
        row_column_BranchChoiceType,
        column: col === NaN ? undefined : col,
        row: row === NaN ? undefined : row,
        choiceType: branchChoiceType,
        operator: isSelectableValueOperator
          ? LogicOperator.SELECTED
          : LogicOperator.EQUAL_TO,
      });
    },
    [setValue, value],
  );

  const shouldRenderLogic = value.row_column_BranchChoiceType;

  const shouldRenderRightOperand = value?.choiceType
    ? ![
        BranchChoiceType.SELECTABLE_CHOICE,
        BranchChoiceType.SELECTABLE_ANSWER,
      ].includes(value?.choiceType)
    : false;
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
        <LogicOperatorInput
          fieldValue={value}
          fieldName={fieldName}
          type={QuestionType.DATA_MATRIX}
        />
      )}
      {shouldRenderRightOperand && (
        <ControlledInput
          className={`w-[150px] ${isViewMode ? 'view-mode' : ''}`}
          inputType={INPUT_TYPES.INPUT}
          name={`${fieldName}.rightOperand`}
        />
      )}
    </>
  );
};

export default DataMatrix;
