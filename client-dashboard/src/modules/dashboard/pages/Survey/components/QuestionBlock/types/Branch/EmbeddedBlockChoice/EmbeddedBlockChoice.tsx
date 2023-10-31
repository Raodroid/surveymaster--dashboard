import React, { FC } from 'react';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { transformEnumToOption } from '@/utils';
import { LogicOperator } from '@/type';
import { useTranslation } from 'react-i18next';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';

export interface IEmbeddedBlockChoice {
  fieldName: string;
  index: number;
}
const EmbeddedBlockChoice: FC<IEmbeddedBlockChoice> = props => {
  const { fieldName, index } = props;
  const { t } = useTranslation();
  const { isViewMode } = useCheckSurveyFormMode();
  return (
    <>
      <ControlledInput
        className={`w-150px] ${isViewMode ? 'view-mode' : ''}`}
        inputType={INPUT_TYPES.INPUT}
        name={`${fieldName}[${index}].leftOperand`}
      />
      <ControlledInput
        className={`w-[150px] ${isViewMode ? 'view-mode' : ''}`}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}[${index}].operator`}
        options={transformEnumToOption(LogicOperator, i => t(`common.${i}`))}
      />
      <ControlledInput
        className={`w-[200px] ${isViewMode ? 'view-mode' : ''}`}
        inputType={INPUT_TYPES.INPUT}
        name={`${fieldName}[${index}].rightOperand`}
      />
    </>
  );
};

export default EmbeddedBlockChoice;
