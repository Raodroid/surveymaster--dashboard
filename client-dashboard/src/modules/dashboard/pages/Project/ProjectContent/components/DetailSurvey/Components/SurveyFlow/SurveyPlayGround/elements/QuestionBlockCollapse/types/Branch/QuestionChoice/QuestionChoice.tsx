import React, { FC, useCallback, useMemo } from 'react';
import { LogicOperator, SubBranchLogicDto } from '@/type';
import { useField, useFormikContext } from 'formik';
import { IAddSurveyFormValues } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/type';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { transformEnumToOption } from '@/utils';
import { getQuestionFromAllBlocks } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Branch/QuestionChoice/util';

interface IQuestionChoice {
  fieldName: string;
  index: number;
}

const QuestionChoice: FC<IQuestionChoice> = props => {
  const { fieldName, index } = props;
  const { t } = useTranslation();

  const { values } = useFormikContext<IAddSurveyFormValues>();

  const [{ value }, , { setValue }] = useField<SubBranchLogicDto>(
    `${fieldName}[${index}]`,
  );

  // const questionTyp = value.qId

  const handleOnChange = useCallback(
    optionValue => {
      const spitedValue = optionValue.split('*');

      const blockId = spitedValue[0];
      const qId = spitedValue[1];

      setValue({
        ...value,
        blockId,
        qId,
      });
    },
    [setValue, value],
  );

  const options = useMemo(() => {
    const result: {
      label: string | undefined;
      options: { label: string; value: string }[];
    }[] = [];
    getQuestionFromAllBlocks(values.version?.surveyFlowElements, result);

    return result;
  }, [values.version?.surveyFlowElements]);

  return (
    <>
      <ControlledInput
        className={'w-[150px]'}
        value={value.qId}
        // onSearch={value => {
        //   setSearchTxt(value);
        // }}
        filterOption={false}
        options={options as any[]}
        placeholder={t('common.selectQuestion')}
        onChange={handleOnChange}
        name={`${fieldName}[${index}].qId`}
        inputType={INPUT_TYPES.SELECT}
      />
      <ControlledInput
        placeholder={'LogicOperator'}
        className={'w-[150px]'}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}[${index}].operator`}
        options={transformEnumToOption(LogicOperator, i => t(`common.${i}`))}
      />
    </>
  );
};

export default QuestionChoice;
