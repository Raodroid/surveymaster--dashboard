import { Record, RecordOf } from 'immutable';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import AuthAction from './auth.actions';
import { StandardAction } from '../types';
import { AuthState } from './types';

export const initData: AuthState = {
  isSigningUp: false,
  accessToken: null,
  refreshToken: null,
  error: '',
  isSigningIn: false,
  isSigningOut: false,
  isVerify: false,
  isFetching: false,
  isFetchingProfile: false,
  currentUserId: null,
  isResettingPassword: false,
  isConfirmingResetPassword: false,
  ConfirmationCode: null,
  userName: '',
  currentEmailForChangePassword: '',
  allRoles: [],
  isResend: false,
  idToken: null,
  loginAt: null,
  currentScopes: null,
};

const initialState = Record(initData)(initData);

export default class AuthReducer {
  static getReducer(
    state: RecordOf<AuthState> = initialState,
    action: StandardAction,
  ): RecordOf<AuthState> {
    switch (action.type) {
      // Sign In
      case AuthAction.TYPES.SIGNIN.START:
      case AuthAction.TYPES.SIGNIN.SUCCESS:
      case AuthAction.TYPES.SIGNIN.FAILURE:
        return AuthReducer.handleSignIn(state, action);

      // Sign Out
      case AuthAction.TYPES.SIGNOUT.START:
      case AuthAction.TYPES.SIGNOUT.SUCCESS:
      case AuthAction.TYPES.SIGNOUT.FAILURE:
        return AuthReducer.handleSignOut(state, action);

      // Verify
      case AuthAction.TYPES.VERIFY.START:
      case AuthAction.TYPES.VERIFY.SUCCESS:
      case AuthAction.TYPES.VERIFY.FAILURE:
        return AuthReducer.handleVerifyAccount(state, action);
      //Reset Password
      case AuthAction.TYPES.RESET_PASSWORD.START:
      case AuthAction.TYPES.RESET_PASSWORD.SUCCESS:
      case AuthAction.TYPES.RESET_PASSWORD.FAILURE:
        return AuthReducer.handleResetPassword(state, action);

      //Confirm reset password
      case AuthAction.TYPES.CONFIRM_RESET_PASSWORD.START:
      case AuthAction.TYPES.CONFIRM_RESET_PASSWORD.SUCCESS:
      case AuthAction.TYPES.CONFIRM_RESET_PASSWORD.FAILURE:
        return AuthReducer.handleConfirmResetPassword(state, action);

      // Get profile
      case AuthAction.TYPES.GET_PROFILE.START:
      case AuthAction.TYPES.GET_PROFILE.SUCCESS:
      case AuthAction.TYPES.GET_PROFILE.FAILURE:
        return AuthReducer.handleGetprofile(state, action);

      // challenge two factor authentication
      case AuthAction.TYPES.CONFIRM_TEXT_SMS.START:
      case AuthAction.TYPES.CONFIRM_TEXT_SMS.SUCCESS:
      case AuthAction.TYPES.CONFIRM_TEXT_SMS.FAILURE:
        return AuthReducer.handleConfirmSms(state, action);

      // challenge change password required
      case AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.START:
      case AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.SUCCESS:
      case AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.FAILURE:
        return AuthReducer.handleUserChangePassDefault(state, action);

      case AuthAction.TYPES.RESEND_CODE.START:
      case AuthAction.TYPES.RESEND_CODE.SUCCESS:
      case AuthAction.TYPES.RESEND_CODE.FAILURE:
        return AuthReducer.handleResendCode(state, action);

      // Update accessToken
      case AuthAction.TYPES.UPDATE_TOKENS:
        return AuthReducer.handleUpdateTokens(state, action);

      // Sync actions
      default:
        return state;
    }
  }

  static handleSignIn = (
    state: RecordOf<AuthState>,
    action: StandardAction,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.SIGNIN.START:
        return state.set('isSigningIn', true).set('error', '');

      case AuthAction.TYPES.SIGNIN.SUCCESS:
        // const decodedToken: { username: string } = action.payload.accessToken
        //   ? jwt_decode(action.payload.accessToken)
        //   : { username: '' };
        const idDecodeToken: {
          defaultProfileId: string | null;
          sub: string | null;
          scopes?: any;
        } = action.payload.idToken
          ? jwt_decode(action.payload.idToken)
          : { defaultProfileId: null, sub: null };

        return (
          state
            .set('isSigningIn', false)
            .set('accessToken', action.payload.accessToken)
            .set('refreshToken', action.payload.refreshToken)
            // .set('currentUserId', idDecodeToken.userId)
            .set('currentUserId', idDecodeToken.sub)
            .set('currentEmailForChangePassword', action.payload.email)
            .set('idToken', action.payload.idToken)
            .set('loginAt', new Date())
            .set('currentScopes', idDecodeToken.scopes)
        );

      case AuthAction.TYPES.SIGNIN.FAILURE:
        return state.set('isSigningIn', false).set('error', action.error);

      default:
        return state;
    }
  };

  static handleSignOut = (
    state: RecordOf<AuthState>,
    action: StandardAction,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.SIGNOUT.START:
        return state.set('isSigningOut', true).set('error', '');

      case AuthAction.TYPES.SIGNOUT.SUCCESS:
        return initialState;

      case AuthAction.TYPES.SIGNOUT.FAILURE:
        return state.set('isSigningOut', false).set('error', action.error);

      default:
        return state;
    }
  };

  static handleVerifyAccount = (
    state: RecordOf<AuthState>,
    action: StandardAction<string>,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.VERIFY.START:
        return state.set('isVerify', true).set('error', '');

      case AuthAction.TYPES.VERIFY.SUCCESS:
        return state.set('isVerify', false);

      case AuthAction.TYPES.VERIFY.FAILURE: {
        return state.set('isVerify', false).set('error', action.error);
      }
      default:
        return state;
    }
  };

  static handleGetprofile = (
    state: RecordOf<AuthState>,
    action: StandardAction,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.GET_PROFILE.START:
        return state.set('isFetchingProfile', true).set('error', '');

      case AuthAction.TYPES.GET_PROFILE.SUCCESS:
        return state.set('isFetchingProfile', false);

      case AuthAction.TYPES.GET_PROFILE.FAILURE:
        return state.set('isFetchingProfile', false).set('error', action.error);

      default:
        return state;
    }
  };

  static handleResetPassword = (
    state: RecordOf<AuthState>,
    action: StandardAction<undefined>,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.RESET_PASSWORD.START:
        return state.set('isResettingPassword', true).set('error', '');

      case AuthAction.TYPES.RESET_PASSWORD.SUCCESS:
        return state.set('isResettingPassword', false).set('userName', '');

      case AuthAction.TYPES.RESET_PASSWORD.FAILURE:
        return state
          .set('isResettingPassword', false)
          .set('error', action.error);

      default:
        return state;
    }
  };

  static handleConfirmResetPassword = (
    state: RecordOf<AuthState>,
    action: StandardAction<string>,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.CONFIRM_RESET_PASSWORD.START:
        return state.set('isConfirmingResetPassword', true).set('error', '');

      case AuthAction.TYPES.CONFIRM_RESET_PASSWORD.SUCCESS:
        return state
          .set('isConfirmingResetPassword', false)
          .set('userName', action.payload || '');

      case AuthAction.TYPES.CONFIRM_RESET_PASSWORD.FAILURE:
        return state
          .set('isConfirmingResetPassword', false)
          .set('error', action.error);

      default:
        return state;
    }
  };

  static handleConfirmSms = (
    state: RecordOf<AuthState>,
    action: StandardAction,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.CONFIRM_TEXT_SMS.START:
        return state.set('error', '');

      case AuthAction.TYPES.CONFIRM_TEXT_SMS.SUCCESS:
        const idDecodeToken: JwtPayload | null = action.payload.idToken
          ? jwt_decode(action.payload.idToken)
          : null;

        if (!idDecodeToken) return state;
        return state
          .set('accessToken', action.payload.accessToken)
          .set('refreshToken', action.payload.refreshToken)
          .set(
            'currentUserId',
            idDecodeToken.sub === undefined ? null : idDecodeToken.sub,
          )
          .set('idToken', action.payload.idToken);

      case AuthAction.TYPES.CONFIRM_TEXT_SMS.FAILURE:
        return state.set('error', action.error);

      default:
        return state;
    }
  };

  static handleUserChangePassDefault = (
    state: RecordOf<AuthState>,
    action: StandardAction,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.START:
        return state.set('error', '');

      case AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.SUCCESS:
        const idDecodeToken: JwtPayload | null = action.payload.idToken
          ? jwt_decode(action.payload.idToken)
          : null;

        if (!idDecodeToken) return state;
        return state
          .set('accessToken', action.payload.accessToken)
          .set('refreshToken', action.payload.refreshToken)
          .set(
            'currentUserId',
            idDecodeToken.sub === undefined ? null : idDecodeToken.sub,
          )
          .set('idToken', action.payload.idToken);

      case AuthAction.TYPES.CHALLENGE_REQUIRED_PASSWORD.FAILURE:
        return state.set('error', action.error);

      default:
        return state;
    }
  };

  static handleResendCode = (
    state: RecordOf<AuthState>,
    action: StandardAction<string>,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.RESEND_CODE.START:
        return state.set('isResend', true).set('error', '');

      case AuthAction.TYPES.RESEND_CODE.SUCCESS:
        return state.set('isResend', false);

      case AuthAction.TYPES.RESEND_CODE.FAILURE: {
        return state.set('isResend', false).set('error', action.error);
      }
      default:
        return state;
    }
  };

  static handleUpdateTokens = (
    state: RecordOf<AuthState>,
    action: StandardAction,
  ): RecordOf<AuthState> => {
    switch (action.type) {
      case AuthAction.TYPES.UPDATE_TOKENS: {
        const { accessToken, idToken } = action.payload;
        return state.set('idToken', idToken).set('accessToken', accessToken);
      }
      default:
        return state;
    }
  };
}
