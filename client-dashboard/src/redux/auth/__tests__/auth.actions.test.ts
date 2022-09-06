import AuthAction from '../auth.actions';
import { createAction, createPayloadAction } from '../../helpers';
import { AuthUserPoolInfo, SignUpPayload } from '../types';
import { ReduxCollectionType } from '../../../enums';

describe('auth actions creators', () => {
  it('resetPassword action creator', () => {
    const verifyPassword: string = 'abc';
    const confirmationCode: string = 'abc';
    const userName: string = 'abc';
    const password: string = 'abc';
    const callback: () => void = () => {};
    expect(
      AuthAction.ResetPassword(
        password,
        verifyPassword,
        confirmationCode,
        userName,
        callback,
      ),
    ).toEqual(
      createPayloadAction(AuthAction.TYPES.RESET_PASSWORD.START, {
        password,
        verifyPassword,
        confirmationCode,
        userName,
        callback,
      }),
    );
  });
  it('resetError action creator', () => {
    const error: string = 'error';
    expect(AuthAction.resetError(error)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.RESET_PASSWORD.FAILURE,
        undefined,
        undefined,
        error,
      ),
    );
  });
  it('resetSuccess action creator', () => {
    expect(AuthAction.resetSuccess()).toEqual(
      createPayloadAction(AuthAction.TYPES.RESET_PASSWORD.SUCCESS),
    );
  });
  it('confirmResetPassword action creator', () => {
    const email: string = 'abc@gmail.com';
    expect(AuthAction.confirmResetPassword(email)).toEqual(
      createPayloadAction(AuthAction.TYPES.CONFIRM_RESET_PASSWORD.START, {
        email,
      }),
    );
  });
  it('confirmResetError action creator', () => {
    const error: string = 'error';
    expect(AuthAction.confirmresetError(error)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.CONFIRM_RESET_PASSWORD.FAILURE,
        undefined,
        undefined,
        error,
      ),
    );
  });
  it('confirmResetSuccess action creator', () => {
    const email: string = 'email';
    expect(AuthAction.confirmresetSuccess(email)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.CONFIRM_RESET_PASSWORD.SUCCESS,
        email,
      ),
    );
  });
  it('fetchUserPool action creator', () => {
    const subdomain: string = 'subdomain';
    expect(AuthAction.fetchUserPool(subdomain)).toEqual(
      createPayloadAction(AuthAction.TYPES.FETCH_USERPOOL.START, { subdomain }),
    );
  });
  it('fetchUserPoolFailure action creator', () => {
    const error: string = 'error';
    expect(AuthAction.fetchUserPoolFailure(error)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.FETCH_USERPOOL.FAILURE,
        undefined,
        undefined,
        error,
      ),
    );
  });
  it('fetchUserPoolSuccess action creator', () => {
    const userPoolInfo: AuthUserPoolInfo = {
      subdomain: 'string | null',
      tenantId: 'string | null',
      userPoolId: 'string | null',
      clientId: 'string | null',
      region: 'string | null',
    };
    const collections: ReduxCollectionType = { TODO: [] };
    expect(AuthAction.fetchUserPoolSuccess(userPoolInfo, collections)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.FETCH_USERPOOL.SUCCESS,
        {
          userPoolInfo,
        },
        { collections },
      ),
    );
  });
  it('getProfile action creator', () => {
    expect(AuthAction.getProfile()).toEqual(
      createPayloadAction(AuthAction.TYPES.GET_PROFILE.START),
    );
  });
  it('getProfileFail action creator', () => {
    expect(AuthAction.getProfileFail()).toEqual(
      createPayloadAction(AuthAction.TYPES.GET_PROFILE.FAILURE),
    );
  });
  it('getProfileFail action creator', () => {
    const collections: ReduxCollectionType = { TODO: [] };
    expect(AuthAction.getProfileSuccess(collections)).toEqual(
      createPayloadAction(AuthAction.TYPES.GET_PROFILE.SUCCESS, undefined, {
        collections,
      }),
    );
  });
  it('userConfirmTextSms action creator', () => {
    const text = 'string';
    const id = 'string';
    const session = 'string';
    expect(AuthAction.userConfirmTextSms(text, id, session)).toEqual(
      createPayloadAction(AuthAction.TYPES.CONFIRM_TEXT_SMS.START, {
        text,
        id,
        session,
      }),
    );
  });
  it('userConfirmTextSmsFail action creator', () => {
    const error: string = 'error';
    expect(AuthAction.userConfirmTextSmsFail(error)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.CONFIRM_TEXT_SMS.FAILURE,
        undefined,
        undefined,
        error,
      ),
    );
  });
  it('userConfirmTextSmsSuccess action creator', () => {
    const payload: Object = {};
    expect(AuthAction.userConfirmTextSmsSuccess(payload)).toEqual(
      createPayloadAction(AuthAction.TYPES.CONFIRM_TEXT_SMS.SUCCESS, payload),
    );
  });
  it('userSignOut action creator', () => {
    expect(AuthAction.userSignOut()).toEqual(
      createPayloadAction(AuthAction.TYPES.SIGNOUT.START),
    );
  });
  it('userSignOutError action creator', () => {
    const error: string = 'error';
    expect(AuthAction.userSignOutError(error)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.SIGNOUT.FAILURE,
        undefined,
        undefined,
        error,
      ),
    );
  });
  it('userSignOutSuccess action creator', () => {
    expect(AuthAction.userSignOutSuccess()).toEqual(
      createPayloadAction(AuthAction.TYPES.SIGNOUT.SUCCESS),
    );
  });
  it('userSignUp action creator', () => {
    const req: SignUpPayload = {
      email: 'string',
      password: 'string',
      passwordConfirm: 'string',
      firstName: 'string',
      lastName: 'string',
      phone: 'string',
      phonePrefix: 'string',
      description: 'string',
      gender: 'male',
      birthday: new Date(),
    };
    expect(AuthAction.userSignUp(req)).toEqual(
      createPayloadAction(AuthAction.TYPES.SIGNUP.START, req),
    );
  });
  it('userSignUpError action creator', () => {
    const error: string = 'error';
    expect(AuthAction.userSignUpError(error)).toEqual(
      createPayloadAction(
        AuthAction.TYPES.SIGNUP.FAILURE,
        undefined,
        undefined,
        error,
      ),
    );
  });
  it('userSignUpSuccess action creator', () => {
    const payload: Object = {};
    expect(AuthAction.userSignUpSuccess(payload)).toEqual(
      createPayloadAction(AuthAction.TYPES.SIGNUP.SUCCESS, payload),
    );
  });
});
