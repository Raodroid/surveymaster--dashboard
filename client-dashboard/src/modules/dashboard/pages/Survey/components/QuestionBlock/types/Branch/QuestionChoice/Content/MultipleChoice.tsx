import React, { FC, useMemo } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import {
  IOptionItem,
  LogicOperator,
  QuestionType,
  SubBranchLogicDto,
} from '@/type';
import LogicOperatorInput from '@pages/Survey/components/QuestionBlock/types/Branch/QuestionChoice/Content/LogicOperatorInput';
import { useField } from 'formik';

const MultipleChoice: FC<IQuestionChoiceComponent> = props => {
  const { fieldName, questionData } = props;

  const [{ value }] = useField<SubBranchLogicDto>(fieldName);

  const options = useMemo<IOptionItem[]>(() => {
    return (questionData?.latestVersion.options || []).map(i => ({
      value: i.id || '',
      label: i.text || '',
    }));
  }, [questionData?.latestVersion.options]);

  const shouldRenderLogic = value.leftOperand;

  return (
    <div>
      <ControlledInput
        placeholder={'LogicOperator'}
        className={'w-[150px]'}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}.leftOperand`}
        options={options}
      />
      <div className={shouldRenderLogic ? 'show-ui' : 'hide-ui'}>
        <LogicOperatorInput
          fieldName={fieldName}
          type={QuestionType.MULTIPLE_CHOICE}
        />
      </div>
    </div>
  );
};

export default MultipleChoice;
