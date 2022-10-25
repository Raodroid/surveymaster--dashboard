import React from 'react';
import { ConfirmSMSStyled } from './style';
import { MobileOutlined } from '@ant-design/icons';
import { Typography, Button, Form } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AuthAction } from 'redux/auth';
import requireAuthentication from 'modules/common/hoc/requireAuthentication';
import { useQuery } from 'utils/funcs';

const { Title } = Typography;

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
  let query = useQuery();
  const onFinish = (values: { smsText: string }) => {
    let id = query.get('id') as string;
    let session = query.get('session') as string;
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
        render={({ handleSubmit }) => (
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
      ></Formik>
    </ConfirmSMSStyled>
  );
};

export default React.memo(requireAuthentication(ConfirmSMS));
