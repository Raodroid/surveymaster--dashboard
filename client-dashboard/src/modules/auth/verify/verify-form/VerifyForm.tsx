import React, { useState } from 'react';
import ReactCodeInput from 'react-verification-code-input';
import { Button, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction, AuthSelectors } from 'redux/auth';
import { useTranslation } from 'react-i18next';
import { VerifyAccountPayload } from 'redux/auth/types';
import { VerifyFormStyled } from './style';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

const VerifyForm = () => {
  const [code, setCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isVerify = useSelector(AuthSelectors.getIsVerify);
  const clientId = useSelector(AuthSelectors.getCognitoClientId);
  const region = useSelector(AuthSelectors.getRegion);
  const isResend = useSelector(AuthSelectors.getIsResend);
  const { t } = useTranslation();
  const location = useLocation();

  const params = qs.parse(location.search.replace('?', ''));

  const email = params['email']?.[0] || '';

  const handleSubmit = () => {
    if (code.length < 6) {
      setIsError(true);
    } else {
      const id = params['email'] as string;
      const req: VerifyAccountPayload = {
        confirmationCode: code,
        id: id && id !== 'null' ? id : email.toLowerCase(),
        clientId,
        region,
      };
      dispatch(AuthAction.userVerifyAccount(req));
    }
  };

  const handleChange = (value: string) => {
    if (value.length < 6) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setCode(value);
  };

  const handleResendCode = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(AuthAction.userResendCode(email));
  };

  return (
    <VerifyFormStyled className="border">
      <div className="info-section">
        <p>{t('common.confirmAMiLiAccount')}</p>
        <div className="group-text">
          <span>{t('common.weHaveSentAnEmailTo')}</span>
          &#160;
          <span className="email">{email}</span>
        </div>
        <span>{t('common.enterConfirmationCode')}</span>
      </div>

      <Form onFinish={handleSubmit}>
        <ReactCodeInput
          onChange={handleChange}
          className="custom-input-verify"
        />
        {isError && (
          <span className="error">
            {t('validation.messages.pleaseFillCode')}
          </span>
        )}

        <Button
          type={'primary'}
          className="secondary-btn"
          htmlType="submit"
          loading={isVerify}
        >
          {t('common.submit')}
        </Button>

        <Button
          onClick={handleResendCode}
          loading={isResend}
          type={'text'}
          className={'dark-btn'}
          style={{ borderWidth: 0, marginBottom: '2.857rem' }}
        >
          {t('common.resendCode')}
        </Button>

        <div className="line" />
      </Form>
    </VerifyFormStyled>
  );
};

export default VerifyForm;
