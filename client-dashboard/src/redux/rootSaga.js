import { all } from 'redux-saga/effects';
import { AuthSaga } from './auth';
import { UserSaga } from './user';

export default function* RootSaga() {
  yield all([AuthSaga(), UserSaga()]);
}
