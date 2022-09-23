import React, { FC, useCallback } from 'react';
import { Form } from 'antd';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { IQuestion, QuestionType } from '../../../../../../type';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { transformEnumToOption } from '../../../../../../utils';
import { useTranslation } from 'react-i18next';
import { FormProps } from 'antd/lib/form/Form';

const formSchema = Yup.object();

const initialFilterFormValues = {
  displayId: '',
  versions: [],
  id: '',
  masterCategoryId: '',
  masterSubCategoryId: '',
  masterVariableName: '',
  masterCombineTokenString: '',
};

const QuestionCategoryForm: FC<
  FormProps & { questionData: IQuestion; isEditMode?: boolean }
> = props => {
  const { questionData, isEditMode, disabled, ...rest } = props;
  const { t } = useTranslation();
  const onFinish = useCallback(values => {}, []);

  return (
    <Formik
      onSubmit={onFinish}
      initialValues={isEditMode ? initialFilterFormValues : questionData}
      validationSchema={formSchema}
      render={({ handleSubmit }) => (
        <Form
          id={'filter-form'}
          layout={'vertical'}
          onFinish={handleSubmit}
          className={'sign-in-form'}
          disabled={!isEditMode && disabled}
          {...rest}
        >
          <div className={'FilerDropdown__body__row'}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name="id"
              label={t('common.question') + ' ID'}
            />
          </div>
          <div className={'FilerDropdown__body__row'}>
            <ControlledInput
              inputType={INPUT_TYPES.SELECT}
              name="masterCategoryId"
              label={t('common.masterQuestionCategory')}
              options={transformEnumToOption(QuestionType, questionType =>
                t(`questionType.${questionType}`),
              )}
            />
          </div>
          <div className={'FilerDropdown__body__row'}>
            <ControlledInput
              inputType={INPUT_TYPES.SELECT}
              name="masterSubCategoryId"
              label={t('common.masterQuestionSubCategory')}
              options={transformEnumToOption(QuestionType, questionType =>
                t(`questionType.${questionType}`),
              )}
            />
          </div>

          <div className={'FilerDropdown__body__row'}>
            <ControlledInput
              label={t('common.masterVariableName')}
              inputType={INPUT_TYPES.INPUT}
              name="masterVariableName"
            />
          </div>
          <div className={'FilerDropdown__body__row'}>
            <ControlledInput
              label={t('common.masterCombineToken')}
              inputType={INPUT_TYPES.INPUT}
              name="masterCombineToken"
            />
          </div>
          <div className={'FilerDropdown__body__row'}>
            <ControlledInput
              label={t('common.version') + ' ID'}
              inputType={INPUT_TYPES.INPUT}
              name="masterCombineToken"
            />
          </div>
        </Form>
      )}
    />
  );
};

export default QuestionCategoryForm;
