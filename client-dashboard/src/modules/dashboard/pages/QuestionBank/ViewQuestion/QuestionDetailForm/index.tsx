import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { useTranslation } from 'react-i18next';
import { QuestionDetailFormWrapper } from './style';

const QuestionDetailForm = props => {
  const { disabled } = props;
  const { t } = useTranslation();

  return (
    <QuestionDetailFormWrapper className={'QuestionDetailForm'}>
      <div className={'QuestionDetailForm__row'}>
        <ControlledInput
          inputType={INPUT_TYPES.INPUT}
          name="questionType"
          label={t('common.questionFieldType')}
          disabled={disabled}
        />
        <ControlledInput
          inputType={INPUT_TYPES.INPUT}
          name="createdAt"
          label={t('common.dateCreated')}
          disabled={disabled}
        />
      </div>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="question"
        label={t('common.question')}
        disabled={disabled}
      />
    </QuestionDetailFormWrapper>
  );
};

export default QuestionDetailForm;
