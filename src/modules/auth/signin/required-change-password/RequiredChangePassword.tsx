import * as Yup from 'yup';
import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { CHALLENGE_PASSWORD_REQUIRED } from 'modules/common/validate/validate';
import { RequiredChangePasswordStyled } from './style';
import { ControlledInput, requireAuthentication } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useDispatch } from 'react-redux';
import { AuthAction } from 'redux/auth';
import { useQuery } from 'utils/funcs';
import { memo } from 'react';

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
  const query = useQuery();
  const onFinish = (values: { password: string }) => {
    const id = query.get('id') as string;
    const session = query.get('session') as string;
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
      >
        {({ handleSubmit }) => (
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
      </Formik>
    </RequiredChangePasswordStyled>
  );
};

export default memo(requireAuthentication(RequiredChangePasswordPage));
