import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import notification from 'customize-components/CustomNotification';
import _get from 'lodash/get';
import UserAction from './user.actions';
import { StandardAction } from '../types';
import { ChangePasswordPayload } from './types';
import { CognitoService, AuthService } from 'services';
import { AuthSelectors } from '../auth';
import AuthAction from '../auth/auth.actions';

const {
  changePasswordSuccess,
  changePasswordFailure,
  changeTwoFactorSuccess,
  changeTwoFactorFailure,
} = UserAction;
const { userSignIn } = AuthAction;

const { USER } = UserAction.TYPES;

function* changePassword(action: StandardAction<ChangePasswordPayload>) {
  const { payload, callback } = action;
  const email = yield select(AuthSelectors.getEmail);
  const accessToken = yield select(AuthSelectors.getAccessToken);
  if (payload) {
    const { currentPassword, password } = payload;
    try {
      yield call(
        CognitoService.changePassword,
        accessToken,
        currentPassword,
        password,
      );
      notification.success({ message: 'Change password Successfully!' });
      yield put(userSignIn(email, password, () => {}));
      yield put(changePasswordSuccess(payload));
      if (callback) callback();
    } catch (error: any) {
      const message = _get(error, 'response.data.message', error.message);
      yield put(changePasswordFailure(message));
      notification.error({ message });
    }
  }
}

function* changeTwoFactorAuthentication(action: StandardAction<boolean>) {
  const { payload } = action;
  try {
    const accessToken = yield select(AuthSelectors.getAccessToken);
    yield call(
      AuthService.changeTwoFactorAuthentication,
      payload as boolean,
      accessToken as string,
    );
    yield put(changeTwoFactorSuccess(payload as boolean));
  } catch (error: any) {
    const message = _get(error, 'response.data.message', error.message);
    console.log(message);
    yield put(changeTwoFactorFailure(message));
    notification.error({ message });
  }
}

export default function* UserSaga(): Generator {
  yield all([
    takeLatest(USER.CHANGE_PASSWORD_START, changePassword),
    takeLatest(USER.CHANGE_TWO_FACTOR_START, changeTwoFactorAuthentication),
  ]);
}
