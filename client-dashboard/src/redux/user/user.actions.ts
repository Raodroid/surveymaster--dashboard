import { createPayloadAction } from '../helpers';
import { StandardAction } from '../types';
import { ChangePasswordPayload } from './index';

export default class UserAction {
  static TYPES = {
    USER: {
      // -- Change password
      CHANGE_PASSWORD_START: 'user/CHANGE_PASSWORD_START',
      CHANGE_PASSWORD_SUCCESS: 'user/CHANGE_PASSWORD_SUCCESS',
      CHANGE_PASSWORD_FAILURE: 'user/CHANGE_PASSWORD_FAILURE',

      // -- Change password
      CHANGE_TWO_FACTOR_START: 'user/CHANGE_TWO_FACTOR_START',
      CHANGE_TWO_FACTOR_SUCCESS: 'user/CHANGE_TWO_FACTOR_SUCCESS',
      CHANGE_TWO_FACTOR_FAILURE: 'user/CHANGE_TWO_FACTOR_FAILURE',
    },
    UI: {
      TOGGLE_DRAWER_VISIBLE: 'user/TOGGLE_DRAWER_VISIBLE',
    },
    UPDATE_REPORT_ID: 'user/UPDATE_REPORT_ID',
  };

  static toggleDrawerVisible = (payload: {
    visible: boolean;
  }): StandardAction<{ visible: boolean }> =>
    createPayloadAction(UserAction.TYPES.UI.TOGGLE_DRAWER_VISIBLE, payload);

  // User Change password
  static changePassword = (
    payload: ChangePasswordPayload,
    callback: () => void,
  ): StandardAction<ChangePasswordPayload> =>
    createPayloadAction(
      UserAction.TYPES.USER.CHANGE_PASSWORD_START,
      payload,
      undefined,
      undefined,
      callback,
    );

  static changePasswordSuccess = (
    payload: ChangePasswordPayload,
  ): StandardAction<ChangePasswordPayload> =>
    createPayloadAction(UserAction.TYPES.USER.CHANGE_PASSWORD_SUCCESS, payload);

  static changePasswordFailure = (error: string): StandardAction =>
    createPayloadAction(
      UserAction.TYPES.USER.CHANGE_PASSWORD_FAILURE,
      undefined,
      undefined,
      error,
    );

  // Enable or disable two factor authentication
  static changeTwoFactor = (
    isEnableTwoFactor: boolean,
  ): StandardAction<boolean> =>
    createPayloadAction(
      UserAction.TYPES.USER.CHANGE_TWO_FACTOR_START,
      isEnableTwoFactor,
    );

  static changeTwoFactorSuccess = (
    isEnableTwoFactor: boolean,
  ): StandardAction<boolean> =>
    createPayloadAction(
      UserAction.TYPES.USER.CHANGE_TWO_FACTOR_SUCCESS,
      isEnableTwoFactor,
    );

  static changeTwoFactorFailure = (error: string): StandardAction =>
    createPayloadAction(UserAction.TYPES.USER.CHANGE_TWO_FACTOR_FAILURE);
}
