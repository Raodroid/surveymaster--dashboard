import React from 'react';
import * as Yup from 'yup';
import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { CHALLENGE_PASSWORD_REQUIRED } from 'modules/common/validate/validate';
import { RequiredChangePasswordStyled } from './style';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useDispatch } from 'react-redux';
import { AuthAction } from 'redux/auth';
import requireAuthentication from 'modules/common/hoc/requireAuthentication';
import { useQuery } from 'utils/funcs';

const initialValues: {
  password: string;
  passwordConfirm: string;
} = {
  password: '',
  passwordConfirm: '',
};

const ChallengePasswordRequiredSchema = Yup.object().shape(
  CHALLENGE_PASSWORD_REQUIRED,
);

const RequiredChangePasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let query = useQuery();
  const onFinish = (values: { password: string }) => {
    let id = query.get('id') as string;
    let session = query.get('session') as string;
    dispatch(AuthAction.userChangePassDefault(values.password, id, session));
  };

  return (
    <RequiredChangePasswordStyled>
      <p>{t('common.changePasswordDefault')}</p>
      <span>{t('common.ruleChangeRequiredPass')}</span>
      <Formik
        onSubmit={onFinish}
        initialValues={initialValues}
        validationSchema={ChallengePasswordRequiredSchema}
        render={({ handleSubmit }) => (
          <Form layout={'vertical'} onFinish={handleSubmit}>
            <ControlledInput
              inputType={INPUT_TYPES.PASSWORD}
              name="password"
              label={t('common.password')}
            />
            <ControlledInput
              inputType={INPUT_TYPES.PASSWORD}
              type={'password'}
              name="passwordConfirm"
              label={t('common.passwordConfirm')}
            />

            <Button
              type={'primary'}
              className="secondary-btn"
              htmlType="submit"
            >
              {t('common.savePassword')}
            </Button>
          </Form>
        )}
      />
    </RequiredChangePasswordStyled>
  );
};

export default React.memo(requireAuthentication(RequiredChangePasswordPage));
