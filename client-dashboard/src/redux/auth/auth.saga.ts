/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  all,
  call,
  fork,
  put,
  delay,
  takeLatest,
  select,
} from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';
import notification from 'customize-components/CustomNotification';
import _get from 'lodash/get';

import AuthAction from './auth.actions';
import { AuthService, UserService } from 'services';
import history from '../../utils/history';
import {
  DEFAULT_THEME_COLOR,
  ReduxCollections,
  ReduxCollectionType,
  ROUTE_PATH,
} from 'enums';
import {
  SignInPayload,
  VerifyAccountPayload,
  ResetPasswordPayload,
  ConfirmResetPasswordPayload,
  AuthChallengePayload,
} from './types';
import { StandardAction } from '../types';
import { clearAxiosToken } from '../../services/survey-master-service/base.service';
import { AUTH_ERROR, AUTH_CHALLENGE } from 'enums';
import { AuthSelectors } from '.';
import { CognitoService } from 'services';
import { getI18n } from 'react-i18next';
import { errorNotification } from 'utils/funcs';

const {
  userSignInSuccess,
  userSignInFail,
  userSignOutSuccess,
  userVerifyAccountSuccess,
  userVerifyError,
  getProfileSuccess,
  getProfileFail,
  resetError,
  resetSuccess,
  confirmresetError,
  confirmresetSuccess,
  userConfirmTextSmsSuccess,
  userConfirmTextSmsFail,
  getAllRoleSuccess,
  getAllRoleFail,
  userChangePassDefaultSuccess,
  userChangePassDefaultFail,
  userResendCodeSuccess,
  userResendCodeError,
} = AuthAction;
const {
  SIGNIN,
  SIGNOUT,
  VERIFY,
  GET_PROFILE,
  RESET_PASSWORD,
  CONFIRM_RESET_PASSWORD,
  CONFIRM_TEXT_SMS,
  GET_ALL_ROLES,
  CHALLENGE_REQUIRED_PASSWORD,
  RESEND_CODE,
} = AuthAction.TYPES;

export function* fetchRequiredData() {
  yield put(AuthAction.getProfile());
  yield put(AuthAction.getAllRole());
}

export function* signInUserWithEmailPassword(
  action: StandardAction<SignInPayload>,
) {
  const { payload } = action;
  const { email, password, callback } = payload as SignInPayload;
  const i18n = getI18n();
  try {
    const data = yield call(CognitoService.signInByCognito, email, password);

    // account enable two factor authentication
    const { ChallengeName } = data;
    switch (ChallengeName) {
      case AUTH_CHALLENGE.SMS_MFA:
      case AUTH_CHALLENGE.NEW_PASSWORD_REQUIRED: {
        const { ChallengeParameters, Session } = data;
        yield put(
          userSignInSuccess({
            accessToken: null,
            refreshToken: null,
            email,
            idToken: null,
          }),
        );
        const params = new URLSearchParams({
          id: ChallengeParameters.USER_ID_FOR_SRP,
          session: Session,
        }).toString();
        if (callback) {
          callback(ChallengeParameters.USER_ID_FOR_SRP, Session);
        }
        // history.push(
        //   ChallengeName === AUTH_CHALLENGE.SMS_MFA
        //     ? ROUTE_PATH.CONFIRM_SMS + '?' + params
        //     : ROUTE_PATH.CHANGE_PASSWORD_CHALLENGE + '?' + params,
        // );
        break;
      }
      default: {
        const accessToken = _get(data, 'AuthenticationResult.AccessToken', '');
        const refreshToken = _get(
          data,
          'AuthenticationResult.RefreshToken',
          '',
        );
        const idToken = _get(data, 'AuthenticationResult.IdToken', '');
        yield put(
          userSignInSuccess({
            accessToken,
            refreshToken,
            email,
            idToken,
          }),
        );
        yield fork(fetchRequiredData);
      }
    }
  } catch (error: any) {
    let errorMessage = error.response?.data?.message || error?.message;
    const id = yield select(AuthSelectors.getCurrentUserId);
    if (errorMessage === AUTH_ERROR.USER_NOT_CONFIRM) {
      yield call(CognitoService.resendCode, email);
      errorMessage =
        errorMessage +
        'We sent a new code to active account, Please check email!';
      notification.error({
        message: i18n?.t('common.signInFail', {
          ERROR_MESSAGE: errorMessage,
        }) as string,
        duration: 8,
      });
      yield put(userSignInFail(errorMessage));
      const params = new URLSearchParams({
        id: id,
        email: email.toLowerCase(),
      }).toString();
      history.push(ROUTE_PATH.VERIFY + '?' + params);
    } else if (errorMessage.includes(AUTH_ERROR.INCORRECT_ACCOUNT)) {
      yield put(userSignInFail(errorMessage));
      errorNotification({
        error,
        i18nKey: 'validation.messages.incorrectAccount',
      });
    } else {
      yield put(userSignInFail(errorMessage));
      errorNotification({
        error,
        i18nKey: 'common.signInFail',
      });
    }
  }
}

export function* signOut(action?: StandardAction<{ isChangeEmail?: boolean }>) {
  const { payload } = action || {};
  const isChangeEmail = payload;
  try {
    const idToken = yield select(AuthSelectors.getIdToken);
    if (idToken) {
      const loginAt = yield select(AuthSelectors.getLoginAt);
    }
    yield call(clearAxiosToken);
    yield put(userSignOutSuccess());
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error?.message;

    ((isChangeEmail && errorMessage !== 'the current user was deleted') ||
      (!isChangeEmail && errorMessage)) &&
      notification.error({
        message: errorMessage,
      });
  }
}

export function* verify(action: StandardAction<VerifyAccountPayload>) {
  const { payload } = action;
  const i18n = getI18n();
  if (payload) {
    try {
      const { id } = payload;
      yield call(AuthService.verifyAccount, payload);
      yield put(userVerifyAccountSuccess(id));
      // notification.success({
      //   message: i18n?.t('common.verifySuccess'),
      // });
      history.push(ROUTE_PATH.VERIFY_SUCCESS);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message;
      yield put(userVerifyError(errorMessage));
      errorNotification({
        error,
        i18nKey: 'common.verifyFail',
      });
    }
  }
}

declare const window: any;

function* identifyUserInspectlet(email) {
  for (let i = 0; i <= 5; i += 1) {
    yield delay(1000);
    if (window['__insp']) {
      window['__insp'].push(['identify', email]);
    }
  }
}

export function* getProfile() {
  try {
    const profile = yield call(UserService.getProfile);
    const collections: ReduxCollectionType = {
      [ReduxCollections.USER]: [profile.data],
    };
    yield put(getProfileSuccess(collections));
    if (process.env.REACT_APP_ENV === 'prod') {
      // yield fork(identifyUserPageSense, profile?.data?.email);
      yield fork(identifyUserInspectlet, profile?.data?.email);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error?.message;
    yield put(getProfileFail(errorMessage));
    errorNotification({
      error,
      i18nKey: 'common.getProfileFail',
    });
  }
}

export function* getAllRole() {
  const i18n = getI18n();
  try {
    const response = yield call(AuthService.getAllRoles);
    yield put(getAllRoleSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error?.message;
    yield put(getAllRoleFail(errorMessage));
    errorNotification({
      error,
      i18nKey: 'common.getRolesFail',
    });
  }
}

export function* handleResetPassword(
  action: StandardAction<ResetPasswordPayload>,
) {
  const { payload } = action;
  const i18n = getI18n();
  if (payload) {
    try {
      const { confirmationCode, verifyPassword, password, userName, callback } =
        payload;
      yield call(CognitoService.forgotPassword, {
        confirmationCode,
        verifyPassword,
        password,
        userName,
      });

      yield put(resetSuccess());
      if (callback) callback();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message;
      yield put(resetError(error.message));
      errorNotification({
        error,
        i18nKey: 'common.resetPasswordFail',
      });
    }
  }
}

export function* handleConfirmResetPassword(
  action: StandardAction<ConfirmResetPasswordPayload>,
) {
  const { payload } = action;
  const i18n = getI18n();
  if (payload) {
    const { email, callback } = payload;
    try {
      yield call(CognitoService.confirmForgotPassword, {
        email,
      });
      yield put(confirmresetSuccess(email));
      const params = new URLSearchParams({
        email: email,
      }).toString();
      history.replace(ROUTE_PATH.RESET_PASSWORD + '?' + params);
      if (callback) callback();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message;
      yield put(confirmresetError(errorMessage));
      errorNotification({
        error,
        i18nKey: 'common.confirmResetPasswordFail',
      });
    }
  }
}

export function* checkFetchProfile() {
  const accessToken = yield select(AuthSelectors.getIdToken);
  if (accessToken) {
    yield fork(fetchRequiredData);
  }
}

export function* userConfirmSms(action: StandardAction<AuthChallengePayload>) {
  const { payload } = action;
  const i18n = getI18n();
  if (payload) {
    const { text, id, session } = payload as AuthChallengePayload;
    try {
      const data = yield call(
        CognitoService.responseAuthChallenge,
        text,
        id,
        session,
        AUTH_CHALLENGE.SMS_MFA,
      );
      const accessToken = _get(data, 'AuthenticationResult.AccessToken', '');
      const refreshToken = _get(data, 'AuthenticationResult.RefreshToken', '');
      const idToken = _get(data, 'AuthenticationResult.IdToken', '');
      yield put(
        userConfirmTextSmsSuccess({ accessToken, refreshToken, idToken }),
      );
      yield fork(fetchRequiredData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message;
      yield put(userConfirmTextSmsFail(errorMessage));
      errorNotification({
        error,
        i18nKey: 'common.confirmSmsFail',
      });
    }
  }
}

export function* userChangePassDefault(
  action: StandardAction<AuthChallengePayload>,
) {
  const { payload } = action;
  const i18n = getI18n();
  if (payload) {
    const { text, id, session } = payload as AuthChallengePayload;
    try {
      const data = yield call(
        CognitoService.responseAuthChallenge,
        text,
        id,
        session,
        AUTH_CHALLENGE.NEW_PASSWORD_REQUIRED,
      );
      const accessToken = _get(data, 'AuthenticationResult.AccessToken', '');
      const refreshToken = _get(data, 'AuthenticationResult.RefreshToken', '');
      const idToken = _get(data, 'AuthenticationResult.IdToken', '');
      yield put(
        userChangePassDefaultSuccess({ accessToken, refreshToken, idToken }),
      );
      yield fork(fetchRequiredData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message;
      errorNotification({
        error,
        i18nKey: 'common.changeDefaultPasswordFail',
      });
      yield put(userChangePassDefaultFail(errorMessage));
    }
  }
}

export function* userResendCode(action: StandardAction<string>) {
  const { payload } = action;
  const i18n = getI18n();
  if (payload) {
    try {
      yield call(CognitoService.resendCode, payload);
      yield put(userResendCodeSuccess(payload));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message;
      errorNotification({
        error,
        i18nKey: 'common.resendCodeFail',
      });
      yield put(userResendCodeError(errorMessage));
    }
  }
}

export function* startStartupBackgroundTasks() {
  yield all([put(AuthAction.fetchUserPool()), checkFetchProfile()]);
}

export default function* AuthSaga(): Generator {
  yield all([
    takeLatest(SIGNIN.START, signInUserWithEmailPassword),
    takeLatest(SIGNOUT.START, signOut),
    takeLatest(GET_PROFILE.START, getProfile),
    takeLatest(VERIFY.START, verify),
    takeLatest(RESET_PASSWORD.START, handleResetPassword),
    takeLatest(CONFIRM_RESET_PASSWORD.START, handleConfirmResetPassword),
    takeLatest(CONFIRM_TEXT_SMS.START, userConfirmSms),
    takeLatest(GET_ALL_ROLES.START, getAllRole),
    takeLatest(CHALLENGE_REQUIRED_PASSWORD.START, userChangePassDefault),
    takeLatest(RESEND_CODE.START, userResendCode),
    takeLatest(REHYDRATE, startStartupBackgroundTasks),
  ]);
}
