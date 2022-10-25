/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReduxCollectionType } from 'enums';
import { createPayloadAction, createAction } from '../helpers';
import { StandardAction } from '../types';
import {
  SignInPayload,
  VerifyAccountPayload,
  ResetPasswordPayload,
  AuthChallengePayload,
} from './types';

export default class AuthAction {
  static TYPES = {
    // Async actions
    // -- Sign in
    SIGNIN: {
      START: 'auth/SIGNIN_START',
      SUCCESS: 'auth/SIGNIN_SUCCESS',
      FAILURE: 'auth/SIGNIN_FAILURE',
    },

    // -- Sign out
    SIGNOUT: {
      START: 'auth/SIGNOUT_START',
      SUCCESS: 'auth/SIGNOUT_SUCCESS',
      FAILURE: 'auth/SIGNOUT_FAILURE',
    },

    // -- Verify account
    VERIFY: {
      START: 'auth/VERIFY_START',
      SUCCESS: 'auth/VERIFY_SUCCESS',
      FAILURE: 'auth/VERIFY_FAILURE',
    },

    CONFIRM_RESET_PASSWORD: {
      START: 'auth/CONFIRM_RESET_PASSWORD_START',
      SUCCESS: 'auth/CONFIRM_RESET_PASSWORD_SUCCESS',
      FAILURE: 'auth/CONFIRM_RESET_PASSWORD_FAILURE',
    },

    RESET_PASSWORD: {
      START: 'auth/RESET_PASSWORD_START',
      SUCCESS: 'auth/RESET_PASSWORD_SUCCESS',
      FAILURE: 'auth/RESET_PASSWORD_FAILURE',
    },

    // -- Get profile
    GET_PROFILE: {
      START: 'auth/GET_PROFILE_START',
      SUCCESS: 'auth/GET_PROFILE_SUCCESS',
      FAILURE: 'auth/GET_PROFILE_FAILURE',
    },

    FETCH_USERPOOL: {
      START: 'auth/FETCH_USERPOOL_START',
      SUCCESS: 'auth/FETCH_USERPOOL_SUCCESS',
      FAILURE: 'auth/FETCH_USERPOOL_FAILURE',
    },

    CONFIRM_TEXT_SMS: {
      START: 'auth/CONFIRM_TEXT_SMS_START',
      SUCCESS: 'auth/CONFIRM_TEXT_SMS_SUCCESS',
      FAILURE: 'auth/CONFIRM_TEXT_SMS_FAILURE',
    },

    GET_ALL_ROLES: {
      START: 'auth/GET_ALL_ROLES_START',
      SUCCESS: 'auth/GET_ALL_ROLES_SUCCESS',
      FAILURE: 'auth/GET_ALL_ROLES_FAILURE',
    },

    // challenge required password
    CHALLENGE_REQUIRED_PASSWORD: {
      START: 'auth/CHALLENGE_REQUIRED_PASSWORD_START',
      SUCCESS: 'auth/CHALLENGE_REQUIRED_PASSWORD_SUCCESS',
      FAILURE: 'auth/CHALLENGE_REQUIRED_PASSWORD_FAILURE',
    },

    RESEND_CODE: {
      START: 'auth/RESEND_CODE_START',
      SUCCESS: 'auth/RESEND_CODE_SUCCESS',
      FAILURE: 'auth/RESEND_CODE_FAILURE',
    },

    UPDATE_TOKENS: 'UPDATE_TOKENS',
    UPDATE_VISIT_COUNT: 'auth/UPDATE_VISIT_COUNT',
    // Sync actions
    ADD_RULE_CACHED: 'auth/ADD_RULE_CACHED',
  };

  // ACTIONS: UPDATE_ACCESS_TOKEN
  static updateTokens = (tokens: {
    accessToken: string;
    idToken: string;
  }): StandardAction =>
    createPayloadAction(AuthAction.TYPES.UPDATE_TOKENS, tokens);

  // ACTIONS: GET_ALL_ROLES
  static getAllRole = (): StandardAction =>
    createPayloadAction(AuthAction.TYPES.GET_ALL_ROLES.START);

  static getAllRoleSuccess = (allRoles): StandardAction<string> =>
    createPayloadAction(AuthAction.TYPES.GET_ALL_ROLES.SUCCESS, allRoles);

  static getAllRoleFail = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.GET_ALL_ROLES.FAILURE,
      undefined,
      undefined,
      error,
    );

  // ACTIONS: SIGNIN
  static userSignIn = (
    email: string,
    password: string,
    callback: (id: any, session: any) => void,
  ): StandardAction<SignInPayload> =>
    createPayloadAction(AuthAction.TYPES.SIGNIN.START, {
      email,
      password,
      callback,
    });

  static userSignInSuccess = (payload: Object): StandardAction =>
    createPayloadAction(AuthAction.TYPES.SIGNIN.SUCCESS, payload);

  static userSignInFail = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.SIGNIN.FAILURE,
      undefined,
      undefined,
      error,
    );

  // ACTIONS: SIGNOUT
  static userSignOut = (
    isChangeEmail?: boolean,
  ): StandardAction<Record<string, unknown>> =>
    createPayloadAction(AuthAction.TYPES.SIGNOUT.START, { isChangeEmail });

  static userSignOutSuccess = (): StandardAction<string> =>
    createPayloadAction(AuthAction.TYPES.SIGNOUT.SUCCESS);

  static userSignOutError = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.SIGNOUT.FAILURE,
      undefined,
      undefined,
      error,
    );

  // ACTIONS: VERIFY
  static userVerifyAccount = (
    req: VerifyAccountPayload,
  ): StandardAction<VerifyAccountPayload> =>
    createPayloadAction(AuthAction.TYPES.VERIFY.START, req);

  static userVerifyAccountSuccess = (
    authUser: string,
  ): StandardAction<string> =>
    createPayloadAction(AuthAction.TYPES.VERIFY.SUCCESS, authUser);

  static userVerifyError = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.VERIFY.FAILURE,
      undefined,
      undefined,
      error,
    );

  // ACTIONS: GET_PROFILE
  static getProfile = (): StandardAction =>
    createPayloadAction(AuthAction.TYPES.GET_PROFILE.START);

  static getProfileSuccess = (
    collections?: ReduxCollectionType,
  ): StandardAction<undefined, { collections?: ReduxCollectionType }> =>
    createPayloadAction(AuthAction.TYPES.GET_PROFILE.SUCCESS, undefined, {
      collections,
    });

  static getProfileFail = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.GET_PROFILE.FAILURE,
      undefined,
      undefined,
      error,
    );

  static fetchUserPool = (
    subdomain?: string,
  ): StandardAction<{ subdomain?: string }> =>
    createPayloadAction(AuthAction.TYPES.FETCH_USERPOOL.START, { subdomain });

  static ResetPassword = (
    password: string,
    verifyPassword: string,
    confirmationCode: string,
    userName: string,
    callback: () => void,
  ): StandardAction<ResetPasswordPayload> =>
    createPayloadAction(AuthAction.TYPES.RESET_PASSWORD.START, {
      password,
      verifyPassword,
      confirmationCode,
      userName,
      callback,
    });

  static resetSuccess = (): StandardAction<string> =>
    createPayloadAction(AuthAction.TYPES.RESET_PASSWORD.SUCCESS);

  static resetError = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.RESET_PASSWORD.FAILURE,
      undefined,
      undefined,
      error,
    );

  static confirmResetPassword = (
    email: string,
    callback?: () => void,
  ): StandardAction<object> =>
    createPayloadAction(AuthAction.TYPES.CONFIRM_RESET_PASSWORD.START, {
      email,
      callback,
    });

  static confirmresetSuccess = (email: string): StandardAction<string> =>
    createPayloadAction(AuthAction.TYPES.CONFIRM_RESET_PASSWORD.SUCCESS, email);

  static confirmresetError = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.CONFIRM_RESET_PASSWORD.FAILURE,
      undefined,
      undefined,
      error,
    );
  // ACTIONS: CONFIRM TEXT SMS
  static userConfirmTextSms = (
    text: string,
    id: string,
    session: string,
  ): StandardAction<AuthChallengePayload> =>
    createPayloadAction(AuthAction.TYPES.CONFIRM_TEXT_SMS.START, {
      text,
      id,
      session,
    });

  static userConfirmTextSmsSuccess = (payload: Object): StandardAction =>
    createPayloadAction(AuthAction.TYPES.CONFIRM_TEXT_SMS.SUCCESS, payload);

  static userConfirmTextSmsFail = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.CONFIRM_TEXT_SMS.FAILURE,
      undefined,
      undefined,
      error,
    );

  // ACTIONS: CHALLENGE REQUIRED PASSWORD
  static userChangePassDefault = (
    text: string,
    id: string,
    session: string,
  ): StandardAction<AuthChallengePayload> =>
    createPayloadAction(AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.START, {
      text,
      id,
      session,
    });

  static userChangePassDefaultSuccess = (payload: Object): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.SUCCESS,
      payload,
    );

  static userChangePassDefaultFail = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.FAILURE,
      undefined,
      undefined,
      error,
    );

  static userResendCode = (email: string): StandardAction<string> =>
    createPayloadAction(AuthAction.TYPES.RESEND_CODE.START, email);

  static userResendCodeSuccess = (email: string): StandardAction<string> =>
    createPayloadAction(AuthAction.TYPES.RESEND_CODE.SUCCESS, email);

  static userResendCodeError = (error?: string): StandardAction =>
    createPayloadAction(
      AuthAction.TYPES.RESEND_CODE.FAILURE,
      undefined,
      undefined,
      error,
    );
}
