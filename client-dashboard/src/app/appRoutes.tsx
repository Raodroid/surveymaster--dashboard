import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useScrollbarContext } from '../scrollbarContext/useScrollBar';
import { ProtectedRoutes } from './protected.route';
import { NoAuthenticationRoutes } from './public.route';
import ReactGA from 'react-ga4';
import { ROUTE_PATH } from '../enums';
import UserDashboardLayout from '../modules/dashboard';

if (process.env.REACT_APP_ENV === 'prod') {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTIC_TRACKING_ID || '');
}

export const ScrollToTop = props => {
  const { scrollToTop } = useScrollbarContext();

  useEffect(() => {
    scrollToTop(0);
  }, [scrollToTop]);

  return props.children;
};

const AppRoutes = () => {
  return (
    <ScrollToTop>
      <Routes>
        <Route path="/app" element={<ProtectedRoutes />}>
          <Route
            path={ROUTE_PATH.DASHBOARD_PATHS.HOME}
            element={<UserDashboardLayout />}
          />
        </Route>
        <Route path="*" element={<NoAuthenticationRoutes />} />
      </Routes>
    </ScrollToTop>
  );
};

export default AppRoutes;
