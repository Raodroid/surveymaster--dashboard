import { FC } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { INPUT_TYPES } from '@input/type';
import { ControlledInput } from '@/modules/common';
import { transformEnumToOption } from '@/utils';
import { LogicOperator, QuestionType } from '@/type';
import { useTranslation } from 'react-i18next';
import LogicOperatorInput from './LogicOperatorInput';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';

const TexNumber: FC<IQuestionChoiceComponent> = props => {
  const { t } = useTranslation();
  const { fieldName } = props;
  const { isViewMode } = useCheckSurveyFormMode();
  return (
    <>
      <LogicOperatorInput
        fieldName={fieldName}
        type={QuestionType.TEXT_ENTRY}
      />
      <ControlledInput
        className={`w-[150px] ${isViewMode ? 'view-mode' : ''}`}
        inputType={INPUT_TYPES.NUMBER}
        name={`${fieldName}.rightOperand`}
        options={transformEnumToOption(LogicOperator, i => t(`common.${i}`))}
      />
    </>
  );
};

export default TexNumber;
