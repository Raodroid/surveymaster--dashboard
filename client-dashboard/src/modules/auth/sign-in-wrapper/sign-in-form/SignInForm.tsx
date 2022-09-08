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
import { SignInUpFormWrapper, PlaceholderCenter } from './style';
import requireAuthentication from 'modules/common/hoc/requireAuthentication';
import { FormWrapper } from 'modules/common/styles';

interface SignInPayload {
  email: string;
  password: string;
}

const initialSignUpPayload = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const isSigningIn = useSelector(AuthSelectors.getIsSigningIn);
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  const search = location.search;
  const navigate = useNavigate();
  const pathname = location.pathname;
  useEffect(() => {
    if (search) {
      const searchParams = new URLSearchParams(search);
      const emailAddress = searchParams.get('email');
      if (emailAddress && myRef.current?.setFieldValue) {
        myRef.current?.setFieldValue!('email', String(emailAddress));
      }
    }
  }, [search, pathname, navigate]);

  useEffect(() => {
    if (!!myRef && !!myRef.current) {
      myRef.current.setValues(newInitValues);
    }
  }, [myRef, newInitValues]);

  const onFinish = useCallback(
    (values: SignInPayload) => {
      dispatch(AuthAction.userSignIn(values.email, values.password));
    },
    [dispatch],
  );

  return (
    <SignInUpFormWrapper>
      <div className="row-1 border">
        <div className="header-contain">
          <p className="header-title">{t(`common.welcomeHere`)}</p>
        </div>
        <Formik
          innerRef={myRef}
          onSubmit={onFinish}
          initialValues={initialSignUpPayload}
          validationSchema={formSchema}
          render={({ handleSubmit }) => (
            <FormWrapper style={{ width: '100%' }}>
              <Form layout={'vertical'} onFinish={handleSubmit}>
                <PlaceholderCenter>
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
                </PlaceholderCenter>
                <Button
                  type={'primary'}
                  className="secondary-btn"
                  loading={isSigningIn}
                  htmlType="submit"
                >
                  {t('common.logIn')}
                </Button>
                <Link
                  to={ROUTE_PATH.RESET_PASSWORD}
                  aria-label="Forgot Password"
                >
                  {t('common.forgotPassword')}
                </Link>
              </Form>
            </FormWrapper>
          )}
        />
      </div>
    </SignInUpFormWrapper>
  );
};

export default requireAuthentication(SignInForm);
