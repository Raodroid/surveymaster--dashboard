import { RecordOf, Record } from 'immutable';
import UserAction from './user.actions';
import { StandardAction } from '../types';
import { UserPayload, UserState, ChangePasswordPayload } from './types';
import { generateIndexes, updateAndIndexingData } from 'redux/helpers';
import { ReduxCollections, ReduxCollectionType, ReduxModules } from 'enums';
import { AuthAction } from '../auth';

export const initData: UserState = {
  users: {},
  error: '',
  isFetching: false,
  isChangePassword: false,
  indexes: generateIndexes(ReduxModules.USER),
};

const initialState = Record(initData)(initData);

export default class UserReducer {
  static getReducer(
    state: RecordOf<UserState> = initialState,
    action: StandardAction,
  ): RecordOf<UserState> {
    const Meta = action.meta as { collections?: ReduxCollectionType };
    const usersFromMeta = Meta?.collections?.[ReduxCollections.USER];
    if (usersFromMeta && usersFromMeta?.length) {
      return UserReducer.handleAddContinues(state, usersFromMeta || []);
    }

    switch (action.type) {
      // Change password user
      case UserAction.TYPES.USER.CHANGE_PASSWORD_START:
      case UserAction.TYPES.USER.CHANGE_PASSWORD_SUCCESS:
      case UserAction.TYPES.USER.CHANGE_PASSWORD_FAILURE:
        return UserReducer.handleChangePassword(state, action);

      // enable or disable two factor authentication
      case UserAction.TYPES.USER.CHANGE_TWO_FACTOR_START:
      case UserAction.TYPES.USER.CHANGE_TWO_FACTOR_SUCCESS:
      case UserAction.TYPES.USER.CHANGE_TWO_FACTOR_FAILURE:
        return UserReducer.handleChangeTwoFactorAuthentication(state, action);

      case AuthAction.TYPES.GET_PROFILE.SUCCESS:
        return UserReducer.handleAddContinues(
          state,
          action.payload.users || [],
        );
      default:
        return state;
    }
  }

  static handleAddContinues = (
    state: RecordOf<UserState>,
    users: UserPayload[],
  ): RecordOf<UserState> => {
    return updateAndIndexingData<UserPayload, UserState>(
      users,
      ReduxModules.USER,
      state,
      true,
    );
  };

  static handleChangePassword = (
    state: RecordOf<UserState>,
    action: StandardAction<ChangePasswordPayload>,
  ): RecordOf<UserState> => {
    switch (action.type) {
      case UserAction.TYPES.USER.CHANGE_PASSWORD_START: {
        return state.set('isChangePassword', true);
      }

      case UserAction.TYPES.USER.CHANGE_PASSWORD_SUCCESS: {
        return state.set('isChangePassword', false);
      }

      case UserAction.TYPES.USER.CHANGE_PASSWORD_FAILURE: {
        return state.set('isChangePassword', false).set('error', action.error);
      }
      default:
        return state;
    }
  };

  static handleChangeTwoFactorAuthentication = (
    state: RecordOf<UserState>,
    action: StandardAction<boolean>,
  ): RecordOf<UserState> => {
    switch (action.type) {
      case UserAction.TYPES.USER.CHANGE_TWO_FACTOR_START: {
        return state;
      }

      case UserAction.TYPES.USER.CHANGE_PASSWORD_FAILURE: {
        return state.set('error', action.error);
      }
      default:
        return state;
    }
  };
}
