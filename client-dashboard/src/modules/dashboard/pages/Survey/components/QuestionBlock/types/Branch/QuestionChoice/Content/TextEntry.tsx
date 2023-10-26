import React, { FC } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { INPUT_TYPES } from '@input/type';
import { ControlledInput } from '@/modules/common';
import { transformEnumToOption } from '@/utils';
import { LogicOperator, QuestionType } from '@/type';
import { useTranslation } from 'react-i18next';
import LogicOperatorInput from '@pages/Survey/components/QuestionBlock/types/Branch/QuestionChoice/Content/LogicOperatorInput';

const TextEntry: FC<IQuestionChoiceComponent> = props => {
  const { t } = useTranslation();
  const { fieldName } = props;
  return (
    <div>
      <ControlledInput
        placeholder={'LogicOperator'}
        className={'w-[150px]'}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}.operator`}
        options={transformEnumToOption(LogicOperator, i => t(`common.${i}`))}
      />
      <LogicOperatorInput
        fieldName={fieldName}
        type={QuestionType.TEXT_ENTRY}
      />
    </div>
  );
};

export default TextEntry;
