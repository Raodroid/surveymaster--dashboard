import { Record, RecordOf } from 'immutable';
import { createTransform } from 'redux-persist';
import { AuthState } from 'redux/auth';
import { initData as initDataAuth } from 'redux/auth/auth.reducer';

const CustomImmutableTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState: RecordOf<AuthState>) => {
    // convert mySet to an Array.
    return inboundState.toJSON();
  },
  // transform state being rehydrated
  (outboundState: AuthState) => {
    // convert mySet back to a Set.
    return Record(outboundState)({
      ...initDataAuth,
      loginAt: outboundState.loginAt,
      accessToken: outboundState.accessToken,
      refreshToken: outboundState.refreshToken,
      idToken: outboundState.idToken,
      currentUserId: outboundState.currentUserId,
      currentEmailForChangePassword:
        outboundState.currentEmailForChangePassword,
      allRoles: outboundState.allRoles,
    });
  },
  // define which reducers this transform gets called for.
  { whitelist: ['auth'] },
);

export default CustomImmutableTransform;
