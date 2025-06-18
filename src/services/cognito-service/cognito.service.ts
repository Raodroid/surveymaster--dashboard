import {
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  CognitoIdentityProviderClient,
  AuthFlowType,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  ChangePasswordCommand,
  RespondToAuthChallengeCommand,
  ChallengeNameType,
} from '@aws-sdk/client-cognito-identity-provider';
import { store } from 'store';
import { AuthSelectors } from 'redux/auth';

const cognitoIdentityServiceProvider = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_APP_AWS_COGNITO_REGION as string,
});

export interface ConfirmResetPasswordParams {
  ClientId: string /* required */;
  ConfirmationCode: string /* required */;
  Password: string /* required */;
  Username: string;
}
export class CognitoService {
  static resendCode(username: string): Promise<any> {
    const clientId = import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID as string;
    const region = import.meta.env.VITE_APP_AWS_COGNITO_REGION as string;
    const params = {
      ClientId: clientId,
      Username: username.toLowerCase(),
      region,
    };
    const command = new ResendConfirmationCodeCommand(params);
    return cognitoIdentityServiceProvider.send(command);
  }

  static signInByCognito(username: string, password: string): Promise<any> {
    const clientId = import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID as string;
    const region = import.meta.env.VITE_APP_AWS_COGNITO_REGION as string;
    const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username.toLowerCase(),
        PASSWORD: password,
      },
      region,
    };
    const command = new InitiateAuthCommand(params);
    return cognitoIdentityServiceProvider.send(command);
  }

  static forgotPassword = (params: {
    password: string;
    verifyPassword: string;
    confirmationCode: string;
    userName: string;
  }): Promise<any> => {
    const clientId = import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID as string;
    const region = import.meta.env.VITE_APP_AWS_COGNITO_REGION as string;
    const parameters = {
      ClientId: clientId /* required */,
      ConfirmationCode: params.confirmationCode /* required */,
      Password: params.password /* required */,
      Username: params.userName.toLowerCase() /* required */,
      region,
    };
    const command = new ConfirmForgotPasswordCommand(parameters);
    return cognitoIdentityServiceProvider.send(command);
  };

  static confirmForgotPassword = (params: { email: string }): Promise<any> => {
    const clientId = import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID as string;
    const region = import.meta.env.VITE_APP_AWS_COGNITO_REGION as string;
    const parameters = {
      ClientId: clientId /* required */,
      Username: params.email.toLowerCase() /* required */,
      region,
    };
    const command = new ForgotPasswordCommand(parameters);
    return cognitoIdentityServiceProvider.send(command);
  };

  static changePassword(
    accessToken: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<any> {
    const region = import.meta.env.VITE_APP_AWS_COGNITO_REGION as string;
    const params = {
      AccessToken: accessToken /* required */,
      PreviousPassword: currentPassword /* required */,
      ProposedPassword: newPassword /* required */,
      region,
    };
    const command = new ChangePasswordCommand(params);
    return cognitoIdentityServiceProvider.send(command);
  }

  static responseAuthChallenge(
    text: string,
    username: string,
    session: string,
    type: ChallengeNameType,
  ): Promise<any> {
    const clientId = import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID as string;
    const region = import.meta.env.VITE_APP_AWS_COGNITO_REGION as string;
    const challengeResponse = {
      SMS_MFA: {
        SMS_MFA_CODE: text,
        USERNAME: username.toLowerCase(),
      },
      NEW_PASSWORD_REQUIRED: {
        NEW_PASSWORD: text,
        USERNAME: username.toLowerCase(),
      },
    };
    const params = {
      ChallengeName: type,
      ClientId: clientId,
      ChallengeResponses: challengeResponse[type],
      Session: session,
      region,
    };
    const command = new RespondToAuthChallengeCommand(params);
    return cognitoIdentityServiceProvider.send(command);
  }

  static async refreshToken(): Promise<any> {
    const clientId = import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID as string;

    const state = store.getState();
    const refreshToken = AuthSelectors.getRefreshToken(state);
    const params = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken as string,
      },
    };
    const command = new InitiateAuthCommand(params);
    return cognitoIdentityServiceProvider.send(command);
  }
}
