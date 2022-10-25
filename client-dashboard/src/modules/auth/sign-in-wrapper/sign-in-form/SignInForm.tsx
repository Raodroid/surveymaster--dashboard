import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { Form, Button } from 'antd';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction, AuthSelectors } from 'redux/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { emailYup, passwordYup } from 'modules/common/validate/validate';
import { SignInUpFormWrapper } from './style';
import requireAuthentication from 'modules/common/hoc/requireAuthentication';
import { FormWrapper } from 'modules/common/styles';
import { LogoIcon } from '../../../../icons';

interface SignInPayload {
  email: string;
  password: string;
  callback?: () => void;
}

const initialSignUpPayload = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const isSigningIn = useSelector(AuthSelectors.getIsSigningIn);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const newInitValues = useMemo<SignInPayload>(() => {
    return {
      ...initialSignUpPayload,
    };
  }, []);

  const formSchema = Yup.object().shape({
    email: emailYup,
    password: passwordYup,
  });

  const myRef = useRef<FormikProps<SignInPayload>>(null);
  const location = useLocation();
  const navigator = useNavigate();
  const search = location.search;
  const pathname = location.pathname;
  useEffect(() => {
    if (search) {
      const searchParams = new URLSearchParams(search);
      const emailAddress = searchParams.get('email');
      if (emailAddress && myRef.current?.setFieldValue) {
        myRef.current?.setFieldValue!('email', String(emailAddress));
      }
    }
  }, [search, pathname]);

  useEffect(() => {
    if (!!myRef && !!myRef.current) {
      myRef.current.setValues(newInitValues);
    }
  }, [myRef, newInitValues]);

  const onFinish = useCallback(
    (values: SignInPayload) => {
      dispatch(
        AuthAction.userSignIn(
          values.email,
          values.password,
          (id: string, session: string) => {
            navigate(`/change-password?id=${id}&session=${session}`);
          },
        ),
      );
    },
    [dispatch, navigate],
  );

  const handleForgotPassword = useCallback(() => {
    navigator(ROUTE_PATH.RESET_PASSWORD);
  }, [navigator]);

  return (
    <SignInUpFormWrapper className={'border'}>
      <div className="sign-in-form__row sign-in-form__body">
        <div className="header-contain">
          <p className="header-title">{t(`common.welcomeTo`)}</p>
          <LogoIcon />
        </div>
        <Formik
          innerRef={myRef}
          onSubmit={onFinish}
          initialValues={initialSignUpPayload}
          validationSchema={formSchema}
          render={({ handleSubmit }) => (
            <FormWrapper>
              <Form
                layout={'vertical'}
                onFinish={handleSubmit}
                className={'sign-in-form'}
              >
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name="email"
                  label={t('common.email')}
                />

                <ControlledInput
                  inputType={INPUT_TYPES.PASSWORD}
                  name="password"
                  label={t(`common.password`)}
                />
                <Button
                  type={'primary'}
                  className="secondary-btn"
                  loading={isSigningIn}
                  htmlType="submit"
                >
                  {t('common.logIn')}
                </Button>

                <Button
                  type={'text'}
                  danger
                  onClick={handleForgotPassword}
                  className={'forgot-password-btn'}
                >
                  {t('common.forgotPassword')}
                </Button>
              </Form>
            </FormWrapper>
          )}
        />
      </div>
      <div className={'sign-in-form__row sign-in-form__footer'}>
        <Button type={'primary'} className={'info-btn'}>
          {t('direction.continueWithGoogle')}
        </Button>
      </div>
    </SignInUpFormWrapper>
  );
};

export default requireAuthentication(SignInForm);
