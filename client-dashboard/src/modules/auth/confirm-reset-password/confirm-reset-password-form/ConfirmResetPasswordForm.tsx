import React from 'react';
import { Form, Button } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction, AuthSelectors } from 'redux/auth';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { ConfirmResetPasswordFormRoot } from './style';
import { emailYup } from 'modules/common/validate/validate';
import { FormWrapper } from 'modules/common/styles';

const layout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
  },
};

const initialValues: { email: string } = {
  email: '',
};
const ConfirmResetPasswordSchema = Yup.object().shape({
  email: emailYup,
});

const ConfirmResetPasswordForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onFinish = (values: { email: string }) => {
    dispatch(AuthAction.confirmResetPassword(values.email));
  };
  const isConfirmingResetPassword = useSelector(
    AuthSelectors.getIsConfirmingResetPassword,
  );
  return (
    <ConfirmResetPasswordFormRoot>
      <p className="title">{t('common.resetPassword')}</p>
      <p className="des">{t('common.descriptionResetPassWord')}</p>
      <Formik
        onSubmit={onFinish}
        initialValues={initialValues}
        validationSchema={ConfirmResetPasswordSchema}
        render={({ handleSubmit }) => (
          <FormWrapper>
            <Form
              {...layout}
              onFinish={handleSubmit}
              className="confirm-reset-password-form"
            >
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                type={'email'}
                name="email"
                placeholder={t('common.email')}
              />
              <Form.Item>
                <Button
                  loading={isConfirmingResetPassword}
                  type={'primary'}
                  className="secondary-btn"
                  htmlType="submit"
                >
                  {t('common.submit')}
                </Button>
              </Form.Item>
            </Form>
          </FormWrapper>
        )}
      />
    </ConfirmResetPasswordFormRoot>
  );
};

export default ConfirmResetPasswordForm;
