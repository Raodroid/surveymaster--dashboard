import React, { lazy, useEffect, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { CustomSpinSuspense } from 'modules/common/styles';
import { ROUTE_PATH } from '../enums';
import { useScrollbarContext } from '../scrollbarContext/useScrollBar';
import { ProtectedRoutes } from './protected.route';
import { NoAuthenticationRoutes } from './public.route';
import { UnProtectedRoutes } from './unProtected.route';

const Home = lazy(() => import('modules/dashboard/pages/Home'));
const Project = lazy(() => import('modules/dashboard/pages/Project'));
const Profile = lazy(() => import('modules/dashboard/pages/Profile'));
const QuestionBank = lazy(() => import('modules/dashboard/pages/QuestionBank'));
const ViewQuestion = lazy(
  () => import('modules/dashboard/pages/QuestionBank/ViewQuestion'),
);
const EditQuestion = lazy(
  () => import('modules/dashboard/pages/QuestionBank/EditQuestion'),
);
const CategoryDetail = lazy(
  () => import('modules/dashboard/pages/QuestionBank/CategoryDetail'),
);
const AddQuestion = lazy(
  () => import('modules/dashboard/pages/QuestionBank/AddQuestion'),
);

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
              path={ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT}
              element={<Profile />}
            >
              <Route
                path={ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM}
                element={<Profile />}
              />
            </Route>
            <Route
              path={ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}
              element={<QuestionBank />}
            >
              <Route index element={<CategoryDetail />} />
              <Route
                path={ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.EDIT_QUESTION}
                element={<EditQuestion />}
              />
              <Route
                path={ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION}
                element={<ViewQuestion />}
              />
              <Route
                path={ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ADD_QUESTION}
                element={<AddQuestion />}
              />
            </Route>
            <Route path="*" element={<Navigate to={'/app'} replace />} />
          </Route>
          <Route path="*" element={<UnProtectedRoutes />}>
            <Route path="*" element={<NoAuthenticationRoutes />} />
          </Route>
        </Routes>
      </Suspense>
    </ScrollToTop>
  );
};

export default AppRoutes;
