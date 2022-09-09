import React, { useCallback, useState } from 'react';
import { Form, Avatar, Spin, Button } from 'antd';
import notification from 'customize-components/CustomNotification';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction, AuthSelectors } from 'redux/auth';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { FORGOT_PASSWORD_FIELD } from 'modules/common/validate/validate';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';
import { FormWrapper } from 'modules/common/styles';
import { useQuery } from 'react-query';
import { ProfileService } from 'services';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { ResetPasswordFormWrapper } from './style';
import { onError } from '../../../../utils';
import ReactCodeInput from 'react-verification-code-input';

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

const initialValues: {
  password: string;
  verifyPassword: string;
} = {
  password: '',
  verifyPassword: '',
};

const ResetPasswordSchema = Yup.object().shape(FORGOT_PASSWORD_FIELD);

interface Props {
  email: string;
}

const ResetPasswordForm: React.FC<Props> = props => {
  const { email } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const isResettingPasswordForm = useSelector(
    AuthSelectors.getIsResettingPassword,
  );

  const { data, isLoading } = useQuery(
    ['getPublicProfile', email],
    () => (email ? ProfileService.getPublicProfile(email) : null),
    {
      onError,
    },
  );

  const { firstName, lastName, avatar } = data?.data || {};

  const openNotification = useCallback(() => {
    notification.success({
      message: 'Reset password successful',
    });
  }, []);

  const goToLoginPage = useCallback(() => {
    openNotification();
    navigate(ROUTE_PATH.LOGIN);
  }, [navigate, openNotification]);
  const handleResend = (values: { email: string }) => {
    dispatch(AuthAction.confirmResetPassword(values.email, resendNotification));
  };
  const isConfirmingResetPassword = useSelector(
    AuthSelectors.getIsConfirmingResetPassword,
  );
  const resendNotification = useCallback(() => {
    notification.success({
      message: 'Resend code successful',
    });
  }, []);

  const onFinish = (values: { password: string; verifyPassword: string }) => {
    dispatch(
      AuthAction.ResetPassword(
        values.verifyPassword,
        values.password,
        confirmationCode,
        email,
        goToLoginPage,
      ),
    );
  };

  const handleChange = (value: string) => {
    if (value.length < 6) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setConfirmationCode(value);
  };

  return (
    <ResetPasswordFormWrapper isError={isError}>
      <Spin spinning={isLoading}>
        <Avatar icon={<UserOutlined />} src={avatar} />
        <p className="title">{t('common.resetYourPassword')}</p>
        <p className="fullname">{`${firstName} ${lastName}`}</p>
        <span>{email}</span>
      </Spin>
      <div className="line" />
      <Formik
        onSubmit={onFinish}
        initialValues={initialValues}
        validationSchema={ResetPasswordSchema}
        render={({ handleSubmit, values, errors }) => (
          <FormWrapper>
            <Form
              // autoComplete="off"
              {...layout}
              layout={'vertical'}
              onFinish={handleSubmit}
              className="reset-password-form"
            >
              {/* <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                type={'text'}
                name="confirmationCode"
                placeholder={'Your code was sent on email'}
              /> */}
              <p className="confirmation-code">
                Enter the confirmation code sent to {email}
              </p>
              <ReactCodeInput
                onChange={handleChange}
                className="confirm-code-sent-email"
              />
              {isError && (
                <span className="error">
                  {t('validation.messages.pleaseFillCode')}
                </span>
              )}
              <ControlledInput
                inputType={INPUT_TYPES.PASSWORD}
                type={'password'}
                name="password"
                placeholder={t('common.password')}
                label={t('common.enterYourNewPassword')}
              />
              <ControlledInput
                inputType={INPUT_TYPES.PASSWORD}
                type={'password'}
                name="verifyPassword"
                placeholder={t('common.retypeNewPassword')}
                label={t('common.confirmYourNewPassword')}
              />
              <Form.Item>
                <div className={'resend-code-section'}>
                  <span>{t('common.dontReceiveCode')}</span>{' '}
                  {!isConfirmingResetPassword ? (
                    <a href=" " onClick={() => handleResend({ email })}>
                      {t('common.resendCode')}
                    </a>
                  ) : (
                    <>
                      <p>{t('common.resendCode')}</p>
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 12 }} spin />
                        }
                        size="small"
                      />
                    </>
                  )}
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type={'primary'}
                  className="secondary-btn"
                  loading={isResettingPasswordForm}
                  htmlType="submit"
                >
                  {t('common.savePassword')}
                </Button>
              </Form.Item>
            </Form>
          </FormWrapper>
        )}
      />
    </ResetPasswordFormWrapper>
  );
};

export default ResetPasswordForm;
