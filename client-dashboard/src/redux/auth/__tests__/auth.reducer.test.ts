import AuthReducer, { initData } from '../auth.reducer';
import AuthAction from '../auth.actions';
import { StandardAction } from '../../types';
import { Record } from 'immutable';
import jwt_decode from 'jwt-decode';
import { AuthUserPoolInfo } from '../types';
import { ReduxCollectionType } from '../../../enums';

describe('auth Reducer', () => {
  it('dispatch AuthAction.TYPES.SIGNUP.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = { type: AuthAction.TYPES.SIGNUP.START };
    expect(AuthReducer.handleSignUp(initialState, action)).toEqual(
      initialState.set('isSigningUp', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.SIGNUP.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.SIGNUP.FAILURE,
      error: 'error',
    };
    expect(AuthReducer.handleSignUp(initialState, action)).toEqual(
      initialState.set('isSigningUp', false).set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.SIGNUP.SUCCESS  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.SIGNUP.SUCCESS,
      payload: { id: '123', email: 'abc@gmail.com' },
    };
    expect(AuthReducer.handleSignUp(initialState, action)).toEqual(
      initialState
        .set('isSigningUp', false)
        .set('currentUserId', action.payload.id)
        .set('currentEmailForChangePassword', action.payload.email),
    );
  });

  it('dispatch AuthAction.TYPES.SIGNIN.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = { type: AuthAction.TYPES.SIGNIN.START };
    expect(AuthReducer.handleSignIn(initialState, action)).toEqual(
      initialState.set('isSigningIn', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.SIGNIN.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.SIGNIN.FAILURE,
      error: 'error',
    };
    expect(AuthReducer.handleSignIn(initialState, action)).toEqual(
      initialState.set('isSigningUp', false).set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.SIGNIN.SUCCESS  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.SIGNIN.SUCCESS,
      payload: {
        accessToken: null,
        refreshToken: null,
        email: 'abc@gmail.com',
        id: 'ChallengeParameters.USER_ID_FOR_SRP',
        session: 'Session',
      },
    };
    const decodedToken: { username: string } = action.payload.accessToken
      ? jwt_decode(action.payload.accessToken)
      : { username: '' };
    expect(AuthReducer.handleSignIn(initialState, action)).toEqual(
      initialState
        .set('isSigningIn', false)
        .set('accessToken', action.payload.accessToken)
        .set('refreshToken', action.payload.refreshToken)
        .set('currentUserId', decodedToken.username)
        .set('currentEmailForChangePassword', action.payload.email)
        .set('idToken', action.payload.idToken),
    );
  });

  it('dispatch AuthAction.TYPES.SIGNOUT.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = { type: AuthAction.TYPES.SIGNOUT.START };
    expect(AuthReducer.handleSignOut(initialState, action)).toEqual(
      initialState.set('isSigningOut', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.SIGNOUT.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.SIGNOUT.FAILURE,
      error: 'error',
    };
    expect(AuthReducer.handleSignOut(initialState, action)).toEqual(
      initialState.set('isSigningOut', false).set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.SIGNOUT.SUCCESS', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.SIGNOUT.SUCCESS,
    };
    expect(AuthReducer.handleSignOut(initialState, action).toJSON()).toEqual(
      initialState
        .set('userPoolInfo', initialState.userPoolInfo)
        .set('isFetchingUserPool', false)
        .toJSON(),
    );
  });

  it('dispatch AuthAction.TYPES.VERIFY.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = { type: AuthAction.TYPES.VERIFY.START };
    expect(AuthReducer.handleVerifyAccount(initialState, action)).toEqual(
      initialState.set('isVerify', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.VERIFY.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.VERIFY.FAILURE,
      error: 'error',
    };
    expect(AuthReducer.handleVerifyAccount(initialState, action)).toEqual(
      initialState.set('isVerify', false).set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.VERIFY.SUCCESS', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.VERIFY.SUCCESS,
    };
    expect(AuthReducer.handleVerifyAccount(initialState, action)).toEqual(
      initialState.set('isVerify', false),
    );
  });

  it('dispatch AuthAction.TYPES.GET_PROFILE.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = { type: AuthAction.TYPES.GET_PROFILE.START };
    expect(AuthReducer.handleGetprofile(initialState, action)).toEqual(
      initialState.set('isFetchingProfile', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.GET_PROFILE.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.GET_PROFILE.FAILURE,
      error: 'error',
    };
    expect(AuthReducer.handleGetprofile(initialState, action)).toEqual(
      initialState.set('isFetchingProfile', false).set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.GET_PROFILE.SUCCESS', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.GET_PROFILE.SUCCESS,
    };
    expect(AuthReducer.handleGetprofile(initialState, action)).toEqual(
      initialState,
    );
  });

  it('dispatch AuthAction.TYPES.RESET_PASSWORD.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.RESET_PASSWORD.START,
    };
    expect(AuthReducer.handleResetPassword(initialState, action)).toEqual(
      initialState.set('isResettingPassword', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.RESET_PASSWORD.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.RESET_PASSWORD.FAILURE,
      error: 'error',
    };
    expect(AuthReducer.handleResetPassword(initialState, action)).toEqual(
      initialState.set('isResettingPassword', false).set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.RESET_PASSWORD.SUCCESS', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.RESET_PASSWORD.SUCCESS,
    };
    expect(AuthReducer.handleResetPassword(initialState, action)).toEqual(
      initialState.set('isResettingPassword', false).set('userName', ''),
    );
  });

  it('dispatch AuthAction.TYPES.CONFIRM_RESET_PASSWORD.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.CONFIRM_RESET_PASSWORD.START,
    };
    expect(
      AuthReducer.handleConfirmResetPassword(initialState, action),
    ).toEqual(
      initialState.set('isConfirmingResetPassword', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.CONFIRM_RESET_PASSWORD.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.CONFIRM_RESET_PASSWORD.FAILURE,
      error: 'error',
    };
    expect(
      AuthReducer.handleConfirmResetPassword(initialState, action),
    ).toEqual(
      initialState
        .set('isConfirmingResetPassword', false)
        .set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.CONFIRM_RESET_PASSWORD.SUCCESS', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.CONFIRM_RESET_PASSWORD.SUCCESS,
    };
    expect(
      AuthReducer.handleConfirmResetPassword(initialState, action),
    ).toEqual(
      initialState
        .set('isConfirmingResetPassword', false)
        .set('userName', action.payload || ''),
    );
  });

  it('dispatch AuthAction.TYPES.FETCH_USERPOOL.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.FETCH_USERPOOL.START,
    };
    expect(AuthReducer.handleFetchUserPool(initialState, action)).toEqual(
      initialState.set('isFetchingUserPool', true).set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.FETCH_USERPOOL.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.FETCH_USERPOOL.FAILURE,
      error: 'error',
    };
    expect(AuthReducer.handleFetchUserPool(initialState, action)).toEqual(
      initialState.set('isFetchingUserPool', false).set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.FETCH_USERPOOL.SUCCESS', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.FETCH_USERPOOL.SUCCESS,
      payload: {
        userPoolInfo: {
          subdomain: null,
          tenantId: null,
          userPoolId: null,
          clientId: null,
          region: null,
        },
      },
    };
    expect(AuthReducer.handleFetchUserPool(initialState, action)).toEqual(
      initialState
        .set('isFetchingUserPool', false)
        .set('userPoolInfo', action.payload.userPoolInfo),
    );
  });

  it('dispatch AuthAction.TYPES.CONFIRM_TEXT_SMS.START  ', () => {
    const initialState = Record(initData)(initData);
    const action: StandardAction = {
      type: AuthAction.TYPES.CONFIRM_TEXT_SMS.START,
    };
    expect(AuthReducer.handleConfirmSms(initialState, action)).toEqual(
      initialState.set('error', ''),
    );
  });
  it('dispatch AuthAction.TYPES.CONFIRM_TEXT_SMS.FAILURE  ', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.CONFIRM_TEXT_SMS.FAILURE,
    };
    expect(AuthReducer.handleConfirmSms(initialState, action)).toEqual(
      initialState.set('error', action.error),
    );
  });
  it('dispatch AuthAction.TYPES.CONFIRM_TEXT_SMS.SUCCESS', () => {
    const initialState = Record(initData)(initData);

    const action: StandardAction = {
      type: AuthAction.TYPES.CONFIRM_TEXT_SMS.SUCCESS,
      payload: {
        accessToken:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN0cmluIiwiaWF0IjoxNjEzNzU2MDIxLCJleHAiOjE2MTM3NTk2NjIsImp0aSI6ImNiMDEyYjJlLWFhMGYtNDI4MC1iMTU5LWIwYTk4MmM5NDAwYyJ9.E6RLBPReYUR4AkWw7l9lsZQ-q9iVViYXOzrqIegKjSk',
        refreshToken: 'string',
      },
    };
    expect(AuthReducer.handleConfirmSms(initialState, action)).toEqual(
      initialState
        .set('accessToken', action.payload.accessToken)
        .set('refreshToken', action.payload.refreshToken)
        .set('currentUserId', 'strin')
        .set('idToken', action.payload.idToken),
    );
  });
});
