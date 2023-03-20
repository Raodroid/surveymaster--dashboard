import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { useGetAllCategories } from '../../util';
import { IAddQuestionFormValue } from '../util';

const QuestionCategoryForm = props => {
  const { disabled } = props;
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<IAddQuestionFormValue>();
  const { categories, isLoading, categoryOptions } = useGetAllCategories();

  const className = disabled ? 'view-mode' : undefined;

  return (
    <>
      {disabled && (
        <ControlledInput
          // disabled={disabled}
          className={className}
          inputType={INPUT_TYPES.INPUT}
          name="id"
          label={t('common.question') + ' ID'}
        />
      )}
      <ControlledInput
        className={className}
        inputType={INPUT_TYPES.SELECT}
        options={categoryOptions}
        name="masterCategoryId"
        aria-label="masterCategoryId"
        label={t('common.masterQuestionCategory')}
        onChange={() => {
          if (disabled) return;
          setFieldValue('masterSubCategoryId', '');
        }}
      />
      <ControlledInput
        loading={isLoading}
        // disabled={disabled || !values.masterCategoryId}
        className={
          disabled || !values.masterCategoryId ? 'view-mode' : undefined
        }
        label={t('common.masterQuestionSubCategory')}
        inputType={INPUT_TYPES.SELECT}
        name="masterSubCategoryId"
        aria-label="masterSubCategoryId"
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
        // disabled={disabled}
        className={className}
        label={t('common.masterVariableName')}
        inputType={INPUT_TYPES.INPUT}
        name="masterVariableName"
        aria-label="masterVariableName"
      />
      {disabled && (
        <ControlledInput
          className={className}
          label={t('common.masterCombineToken')}
          inputType={INPUT_TYPES.INPUT}
          name="masterCombineToken"
          aria-label={'masterCombineToken'}
        />
      )}
      {disabled && (
        <ControlledInput
          className={className}
          label={t('common.version') + ' ID'}
          inputType={INPUT_TYPES.INPUT}
          name="displayId"
          aria-label={'displayId'}
        />
      )}
    </>
  );
};

export default QuestionCategoryForm;
