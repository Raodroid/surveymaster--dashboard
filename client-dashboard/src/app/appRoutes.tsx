import React, { lazy, useEffect, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useScrollbarContext } from '../scrollbarContext/useScrollBar';
import { ProtectedRoutes } from './protected.route';
import { NoAuthenticationRoutes } from './public.route';
import { FULL_ROUTE_PATH, ROUTE_PATH } from '../enums';
import { CustomSpinSuspense } from 'modules/common/styles';

const Home = lazy(() => import('modules/dashboard/pages/Home'));
const Project = lazy(() => import('modules/dashboard/pages/Project'));
const Profile = lazy(() => import('modules/dashboard/pages/Profile'));
const QuestionBank = lazy(() => import('modules/dashboard/pages/QuestionBack'));

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
      <Suspense fallback={<CustomSpinSuspense />}>
        <Routes>
          <Route path={'/app'} element={<ProtectedRoutes />}>
            <Route index element={<Home />} />
            <Route path={'/app/project'} element={<Project />} />
            <Route
              path={ROUTE_PATH.DASHBOARD_PATHS.PROJECT}
              element={<Project />}
            />
            <Route
              path={ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME + '/*'}
              element={<Profile />}
            />
            <Route
              path={FULL_ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK}
              element={<QuestionBank />}
            />
            <Route path="*" element={<Navigate to={'/app'} replace />} />
          </Route>
          <Route path="*" element={<NoAuthenticationRoutes />} />
        </Routes>
      </Suspense>
    </ScrollToTop>
  );
};

export default AppRoutes;
