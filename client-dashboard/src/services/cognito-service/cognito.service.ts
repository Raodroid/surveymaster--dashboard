import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { store } from 'store';
import { AuthSelectors } from 'redux/auth';

let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
  region: process.env.REACT_APP_AWS_COGNITO_REGION as string,
});

export interface ConfirmResetPasswordParams {
  ClientId: string /* required */;
  ConfirmationCode: string /* required */;
  Password: string /* required */;
  Username: string;
}
export class CognitoService {
  static resendCode(username: string): Promise<any> {
    const clientId = process.env.REACT_APP_AWS_USER_POOL_ID as string;
    cognitoIdentityServiceProvider.config.region = process.env
      .REACT_APP_AWS_COGNITO_REGION as string;
    let params = {
      ClientId: clientId,
      Username: username.toLowerCase(),
    };
    return cognitoIdentityServiceProvider
      .resendConfirmationCode(params)
      .promise();
  }

  static signInByCognito(username: string, password: string): Promise<any> {
    const clientId = process.env.REACT_APP_AWS_USER_POOL_ID as string;
    cognitoIdentityServiceProvider.config.region = process.env
      .REACT_APP_AWS_COGNITO_REGION as string;
    let params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username.toLowerCase(),
        PASSWORD: password,
      },
    };
    return cognitoIdentityServiceProvider.initiateAuth(params).promise();
  }

  static forgotPassword = (params: {
    password: string;
    verifyPassword: string;
    confirmationCode: string;
    userName: string;
  }): Promise<any> => {
    const clientId = process.env.REACT_APP_AWS_USER_POOL_ID as string;
    cognitoIdentityServiceProvider.config.region = process.env
      .REACT_APP_AWS_COGNITO_REGION as string;
    let parameters = {
      ClientId: clientId /* required */,
      ConfirmationCode: params.confirmationCode /* required */,
      Password: params.password /* required */,
      Username: params.userName.toLowerCase() /* required */,
    };
    return cognitoIdentityServiceProvider
      .confirmForgotPassword(parameters as ConfirmResetPasswordParams)
      .promise();
  };

  static confirmForgotPassword = (params: { email: string }): Promise<any> => {
    const clientId = process.env.REACT_APP_AWS_USER_POOL_ID as string;
    cognitoIdentityServiceProvider.config.region = process.env
      .REACT_APP_AWS_COGNITO_REGION as string;
    let parameters = {
      ClientId: clientId /* required */,
      Username: params.email.toLowerCase() /* required */,
    };
    return cognitoIdentityServiceProvider
      .forgotPassword(parameters as { ClientId: string; Username: string })
      .promise();
  };

  static changePassword(
    accessToken: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<any> {
    cognitoIdentityServiceProvider.config.region = process.env
      .REACT_APP_AWS_COGNITO_REGION as string;
    let params = {
      AccessToken: accessToken /* required */,
      PreviousPassword: currentPassword /* required */,
      ProposedPassword: newPassword /* required */,
    };
    return cognitoIdentityServiceProvider.changePassword(params).promise();
  }

  static responseAuthChallenge(
    text: string,
    username: string,
    session: string,
    type: string,
  ): Promise<any> {
    const clientId = process.env.REACT_APP_AWS_USER_POOL_ID as string;
    cognitoIdentityServiceProvider.config.region = process.env
      .REACT_APP_AWS_COGNITO_REGION as string;
    let challengeResponse = {
      SMS_MFA: {
        SMS_MFA_CODE: text,
        USERNAME: username.toLowerCase(),
      },
      NEW_PASSWORD_REQUIRED: {
        NEW_PASSWORD: text,
        USERNAME: username.toLowerCase(),
      },
    };
    let params = {
      ChallengeName: type,
      ClientId: clientId,
      ChallengeResponses: challengeResponse[type],
      Session: session,
    };
    return cognitoIdentityServiceProvider
      .respondToAuthChallenge(params)
      .promise();
  }

  static async refreshToken(): Promise<any> {
    let clientId = process.env.REACT_APP_AWS_USER_POOL_ID as string;
    cognitoIdentityServiceProvider.config.region = process.env
      .REACT_APP_AWS_COGNITO_REGION as string;
    const state = store.getState();
    const refreshToken = AuthSelectors.getRefreshToken(state);
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken as string,
      },
    };
    return cognitoIdentityServiceProvider.initiateAuth(params).promise();
  }
}
