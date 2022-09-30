import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { useTranslation } from 'react-i18next';

const QuestionCategoryForm = props => {
  const { disabled } = props;
  const { t } = useTranslation();

  return (
    <>
      {disabled && (
        <ControlledInput
          disabled={disabled}
          inputType={INPUT_TYPES.INPUT}
          name="id"
          label={t('common.question') + ' ID'}
        />
      )}
      <ControlledInput
        disabled={disabled}
        inputType={INPUT_TYPES.INPUT}
        name="masterCategoryId"
        label={t('common.masterQuestionCategory')}
      />
      <ControlledInput
        disabled={disabled}
        inputType={INPUT_TYPES.INPUT}
        name="masterSubCategoryId"
        label={t('common.masterQuestionSubCategory')}
      />
      <ControlledInput
        disabled={disabled}
        label={t('common.masterVariableName')}
        inputType={INPUT_TYPES.INPUT}
        name="masterVariableName"
      />
      {disabled && (
        <ControlledInput
          disabled={disabled}
          label={t('common.masterCombineToken')}
          inputType={INPUT_TYPES.INPUT}
          name="masterCombineToken"
        />
      )}
      {disabled && (
        <ControlledInput
          disabled={disabled}
          label={t('common.version') + ' ID'}
          inputType={INPUT_TYPES.INPUT}
          name="masterCombineToken"
        />
      )}
    </>
  );
};

export default QuestionCategoryForm;
