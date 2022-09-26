export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  error?: string;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  isVerify: boolean;
  isFetching: boolean;
  isFetchingProfile: boolean;
  isResettingPassword: boolean;
  isConfirmingResetPassword: boolean;
  allRoles: Object;
  loginAt: null | Date;

  currentUserId: string | null;

  ConfirmationCode: string | null;
  userName: string;

  currentEmailForChangePassword: string;
  isResend: boolean;
  idToken: string | null;
}

export interface SignInPayload {
  email: string;
  password: string;
  callback?: (id?: string, session?: string) => void;
}
export interface VerifyAccountPayload {
  confirmationCode: string;
  id: string;
  clientId: string;
  region: string;
}

export interface ResetPasswordPayload {
  password: string;
  verifyPassword: string;
  confirmationCode: string;
  userName: string;
  callback?: () => void;
}

export interface ConfirmResetPasswordPayload {
  email: string;
  callback?: () => void;
}

export interface AuthChallengePayload {
  text: string;
  id: string;
  session: string;
}
