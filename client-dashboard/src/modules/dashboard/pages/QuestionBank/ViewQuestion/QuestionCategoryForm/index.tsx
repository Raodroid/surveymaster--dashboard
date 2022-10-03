import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { useGetAllCategories } from '../../util';
import { IAddQuestionFormValue } from '../../AddQuestion';

const QuestionCategoryForm = props => {
  const { disabled } = props;
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<IAddQuestionFormValue>();
  const { categories, isLoading, categoryOptions } = useGetAllCategories();

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
        inputType={INPUT_TYPES.SELECT}
        options={categoryOptions}
        name="masterCategoryId"
        label={t('common.masterQuestionCategory')}
        onChange={() => {
          if (disabled) return;
          setFieldValue('masterSubCategoryId', '');
        }}
      />

      <ControlledInput
        loading={isLoading}
        disabled={disabled || !values.masterCategoryId}
        label={t('common.masterQuestionSubCategory')}
        inputType={INPUT_TYPES.SELECT}
        name="masterSubCategoryId"
        maxTagCount="responsive"
        options={(() => {
          const x = categories?.find(i => i.id === values.masterCategoryId);
          if (!x?.children) return [];
          return x.children?.map(child => ({
            label: child.name as string,
            value: child.id as string,
          }));
        })()}
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
