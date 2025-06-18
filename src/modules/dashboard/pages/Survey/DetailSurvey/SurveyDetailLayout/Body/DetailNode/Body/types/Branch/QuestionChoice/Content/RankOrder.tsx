import { FC, useCallback, useMemo } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import {
  IOptionItem,
  LogicOperator,
  QuestionType,
  SubBranchLogicDto,
} from '@/type';
import { useField } from 'formik';
import LogicOperatorInput from './LogicOperatorInput';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { transformEnumToOption } from '@/utils';
import { useTranslation } from 'react-i18next';

const RankOrder: FC<IQuestionChoiceComponent> = props => {
  const { fieldName, questionData } = props;
  const { isViewMode } = useCheckSurveyFormMode();
  const { t } = useTranslation();

  const [{ value }, , { setValue }] = useField<SubBranchLogicDto>(fieldName);

  const options = useMemo<IOptionItem[]>(() => {
    return (questionData?.options || []).map(i => ({
      value: i.id || '',
      label: i.text || '',
    }));
  }, [questionData?.options]);

  const handleOnchange = useCallback(
    optionValue => {
      const optionSort = (questionData?.options || []).find(
        option => option.id === optionValue,
      )?.sort;

      setValue({
        ...value,
        leftOperand: optionValue,
        optionSort,
      });
    },
    [questionData?.options, setValue, value],
  );

  const shouldRenderLogic = value.leftOperand;

  return (
    <>
      <ControlledInput
        onChange={handleOnchange}
        className={`w-[150px] ${isViewMode ? 'view-mode' : ''}`}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}.leftOperand`}
        options={options}
      />
      {shouldRenderLogic && (
        <>
          <LogicOperatorInput
            fieldName={fieldName}
            type={QuestionType.MULTIPLE_CHOICE}
          />
          <ControlledInput
            className={`w-[150px] ${isViewMode ? 'view-mode' : ''}`}
            inputType={INPUT_TYPES.INPUT}
            name={`${fieldName}.rightOperand`}
            options={transformEnumToOption(LogicOperator, i =>
              t(`common.${i}`),
            )}
          />
        </>
      )}
    </>
  );
};

export default RankOrder;
