import { RootState } from '../types';
export default class UserSelectors {
  static getUser(state: RootState) {
    return state.user;
  }

  static getUsers(state: RootState) {
    return state.user.users;
  }

  static getIsFetching(state: RootState) {
    return state.user.isFetching;
  }

  static getIsChangePassword(state: RootState) {
    return state.user.isChangePassword;
  }
}
