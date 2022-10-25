/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { ReduxModulesName } from 'enums';
import { AuthReducer } from 'redux/auth';
import { UserReducer } from 'redux/user';
/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer() {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  return combineReducers({
    [ReduxModulesName.AUTH]: AuthReducer.getReducer,
    [ReduxModulesName.USER]: UserReducer.getReducer,
  });
}
