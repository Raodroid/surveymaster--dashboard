import APIService from './base.service';
import { AxiosResponse } from 'axios';
import { VerifyAccountPayload } from 'redux/auth/types';
import { changeEmailPayload } from 'modules/auth/change-email/change-email-form/ChangeEmailForm';

export default class AuthService {
  static login(email: string, password: string): Promise<AxiosResponse> {
    return APIService.post('/auth/login', {
      email: email.toLowerCase(),
      password,
    });
  }

  static verifyAccount(req: VerifyAccountPayload): Promise<AxiosResponse> {
    const url = '/auth/confirmByEmail';
    return APIService.post(url, {
      confirmationCode: req.confirmationCode,
      id: req.id,
    });
  }
  static changeTwoFactorAuthentication(
    isEnableSMSSetting: boolean,
    accessToken: string,
  ): Promise<AxiosResponse> {
    const url = 'auth/SMSMfa';
    return APIService.post(url, { isEnableSMSSetting, accessToken });
  }

  static changeEmail(payload: changeEmailPayload): Promise<AxiosResponse> {
    const url = 'auth/change-email';
    return APIService.patch(url, payload);
  }
}
