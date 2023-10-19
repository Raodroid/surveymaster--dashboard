import React, { FC } from 'react';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { transformEnumToOption } from '@/utils';
import { LogicOperator } from '@/type';
import { useTranslation } from 'react-i18next';

interface IEmbeddedBlockChoice {
  fieldName: string;
  index: number;
}
const EmbeddedBlockChoice: FC<IEmbeddedBlockChoice> = props => {
  const { fieldName, index } = props;
  const { t } = useTranslation();
  return (
    <>
      <ControlledInput
        className={'w-150px]'}
        label={t('common.field')}
        inputType={INPUT_TYPES.INPUT}
        name={`${fieldName}[${index}].rightOperand`}
      />
      <ControlledInput
        placeholder={'LogicOperator'}
        className={'w-[150px]'}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}[${index}].operator`}
        options={transformEnumToOption(LogicOperator, i => t(`common.${i}`))}
      />
      <ControlledInput
        className={'w-[200px]'}
        label={t('common.value')}
        inputType={INPUT_TYPES.INPUT}
        name={`${fieldName}[${index}].rightOperand`}
      />
    </>
  );
};

export default EmbeddedBlockChoice;
