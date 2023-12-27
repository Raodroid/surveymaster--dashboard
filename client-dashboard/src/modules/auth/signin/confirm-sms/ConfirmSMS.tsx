import {ConfirmSMSStyled} from './style';
import {Button, Form} from 'antd';
import {ControlledInput, requireAuthentication} from 'modules/common';
import {INPUT_TYPES} from 'modules/common/input/type';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {AuthAction} from 'redux/auth';
import {useQuery} from 'utils/funcs';
import {memo} from 'react';

const initialValues: {
  smsText: string;
} = {
  smsText: '',
};

const ConfirmSMSSchema = Yup.object().shape({
  smsText: Yup.string().required('validation.messages.required'),
});

const ConfirmSMS = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useQuery();
  const onFinish = (values: { smsText: string }) => {
    const id = query.get('id') as string;
    const session = query.get('session') as string;
    dispatch(AuthAction.userConfirmTextSms(values.smsText, id, session));
  };
  return (
    <ConfirmSMSStyled>
      <p>{t('securitySection.stepTwoVerification')}</p>
      <span>{t('securitySection.rule')}</span>
      <Formik
        onSubmit={onFinish}
        initialValues={initialValues}
        validationSchema={ConfirmSMSSchema}
      >
        {({ handleSubmit }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name="smsText"
              label={t('common.code')}
            />
            <Button type="primary" htmlType="submit">
              {t('common.submit')}
            </Button>
          </Form>
        )}
      </Formik>
    </ConfirmSMSStyled>
  );
};

export default memo(requireAuthentication(ConfirmSMS));
