export const AUTH_ERROR = {
  USER_NOT_CONFIRM: 'User is not confirmed.',
  INCORRECT_ACCOUNT: 'Incorrect username or password',
};

export enum RoleEnum {
  STAFF_SUPER_ADMIN = 1,
  STAFF_NORMAL_USER = 2,
  STAFF_VIEWER = 3,
}

export const STAFF_ADMIN_DASHBOARD_ROLE_LIMIT = [RoleEnum.STAFF_SUPER_ADMIN];

export const AUTH_CHALLENGE = {
  SMS_MFA: 'SMS_MFA',
  NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
};
