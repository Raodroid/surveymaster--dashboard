import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  VerifyPage,
  VerifySuccess,
  ConfirmResetPasswordPage,
  ConfirmSMS,
  RequiredChangePasswordPage,
} from 'modules/auth';
import { NotFoundPage } from 'modules/common-pages';
import { ROUTE_PATH } from 'enums';
import { CustomSpinSuspense } from 'modules/common/styles';

const SignInUpPage = lazy(
  () => import('modules/auth/sign-in-wrapper/SignInPage'),
);

export const NoAuthenticationRoutes = () => (
  <Suspense fallback={<CustomSpinSuspense />}>
    <Routes>
      <Route path={ROUTE_PATH.LOGIN} element={<SignInUpPage />} />

      <Route path={ROUTE_PATH.VERIFY} element={<VerifyPage />} />
      <Route path={ROUTE_PATH.CONFIRM_SMS} element={<ConfirmSMS />} />
      <Route
        path={ROUTE_PATH.CHANGE_PASSWORD_CHALLENGE}
        element={<RequiredChangePasswordPage />}
      />
      <Route path={ROUTE_PATH.VERIFY_SUCCESS} element={<VerifySuccess />} />
      <Route
        path={ROUTE_PATH.RESET_PASSWORD}
        element={<ConfirmResetPasswordPage />}
      />

      <Route path={ROUTE_PATH.NOTFOUND} element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to={ROUTE_PATH.LOGIN} replace />} />
    </Routes>
  </Suspense>
);
