import React, { FC, useMemo } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { IOptionItem, QuestionType, SubBranchLogicDto } from '@/type';
import { useField } from 'formik';
import LogicOperatorInput from './LogicOperatorInput';

const MultipleChoice: FC<IQuestionChoiceComponent> = props => {
  const { fieldName, questionData } = props;

  const [{ value }] = useField<SubBranchLogicDto>(fieldName);

  const options = useMemo<IOptionItem[]>(() => {
    return (questionData?.options || []).map(i => ({
      value: i.id || '',
      label: i.text || '',
    }));
  }, [questionData?.options]);

  const shouldRenderLogic = value.leftOperand;

  return (
    <>
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
    </>
  );
};

export default MultipleChoice;
