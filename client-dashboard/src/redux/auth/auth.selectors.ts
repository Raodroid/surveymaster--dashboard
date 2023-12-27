import { UserSelectors } from 'redux/user';
import { createSelector } from 'reselect';
import { getAllScopes } from 'utils/funcs';
import { RootState } from '../types';

export default class AuthSelectors {
  static getAuth(state: RootState) {
    return state.auth;
  }

  static getAccessToken(state: RootState) {
    return state.auth.accessToken;
  }

  static getRefreshToken(state: RootState) {
    return state.auth.refreshToken;
  }

  static getIsSigningIn(state: RootState) {
    return state.auth.isSigningIn;
  }

  static getIsVerify(state: RootState) {
    return state.auth.isVerify;
  }

  static getCurrentUserId(state: RootState) {
    return state.auth.currentUserId;
  }

  static getAllRoles(state: RootState) {
    return state.auth.allRoles;
  }

  static getProfile = createSelector(
    AuthSelectors.getCurrentUserId,
    UserSelectors.getUsers,
    (currentUserId, users) => {
      if (!currentUserId) return null;
      return users[currentUserId];
    },
  );

  static getIsFetchingProfile(state: RootState) {
    return state.auth.isFetchingProfile;
  }

  static getCurrentScopes = createSelector(AuthSelectors.getProfile, user => {
    if (!user) return [];
    if (user && user.roles) {
      return getAllScopes(user.roles);
    }
    return [];
  });

  static getCurrentRoleIds = createSelector(AuthSelectors.getProfile, user => {
    if (!user) return [];
    if (user && user.userRoles) {
      return user.userRoles[0].roleId;
    }
    return [];
  });

  static getIsConfirmingResetPassword(state: RootState) {
    return state.auth.isConfirmingResetPassword;
  }
  static getIsResettingPassword(state: RootState) {
    return state.auth.isResettingPassword;
  }
  static getUserName(state: RootState) {
    return state.auth.userName;
  }

  static getEmail(state: RootState) {
    return state.auth.currentEmailForChangePassword;
  }

  static getIsResend(state: RootState) {
    return state.auth.isResend;
  }

  static getIdToken(state: RootState) {
    return state.auth.idToken;
  }

  static getLoginAt(state: RootState) {
    return state.auth.loginAt;
  }

  static getCountryCode = createSelector(
    AuthSelectors.getCurrentUserId,
    UserSelectors.getUsers,
    (currentUserId, users) => {
      if (!currentUserId) return '';
      return users[currentUserId]?.country || '';
    },
  );

  static getCognitoClientId(): string {
    return import.meta.env.VITE_APP_AWS_COGNITO_CLIENT_ID as string;
  }
  static getRegion(): string {
    return import.meta.env.VITE_APP_AWS_COGNITO_REGION as string;
  }
}
