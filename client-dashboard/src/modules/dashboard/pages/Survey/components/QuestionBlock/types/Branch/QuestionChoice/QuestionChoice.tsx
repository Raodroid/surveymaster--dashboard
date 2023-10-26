import React, { FC, useCallback, useMemo, useState } from 'react';
import { IOptionGroupItem, IQuestion, SubBranchLogicDto } from '@/type';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { questionChoiceMap } from './util';
import { useSurveyFormContext } from '@pages/Survey/components/SurveyFormContext/SurveyFormContext';

export interface IQuestionChoice {
  fieldName: string;
  index: number;
  options: IOptionGroupItem[];
}

const QuestionChoice: FC<IQuestionChoice> = props => {
  const { fieldName, index, options } = props;
  const { t } = useTranslation();
  const { question } = useSurveyFormContext();
  const { questionIdMap } = question;

  const [{ value }, , { setValue }] = useField<SubBranchLogicDto>(
    `${fieldName}[${index}]`,
  );

  const [currQuestion, setCurrQuestion] = useState<IQuestion | undefined>();

  const handleOnChange = useCallback(
    optionValue => {
      const spitedValue = optionValue.split('*');

      const blockSort = spitedValue[0];
      const qId = spitedValue[1];

      const selectedQuestion = questionIdMap[qId];

      if (!selectedQuestion) return;
      setCurrQuestion(selectedQuestion);
      setValue({
        ...value,
        blockSort,
        qId,
      });
    },
    [questionIdMap, setValue, value],
  );

  const QuestionComponent = useMemo(() => {
    const questionType = currQuestion?.latestVersion?.type;
    return questionType ? questionChoiceMap[questionType] : () => null;
  }, [currQuestion?.latestVersion?.type]);

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
      <QuestionComponent
        fieldName={`${fieldName}[${index}]`}
        questionData={currQuestion}
      />
    </>
  );
};

export default QuestionChoice;
