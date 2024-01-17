import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { CustomSpinSuspense } from 'modules/common/styles';
import { useScrollbarContext } from '@/scrollbarContext/useScrollBar';
import { ProtectedRoutes } from './protected.route';
import { NoAuthenticationRoutes } from './public.route';
import { UnProtectedRoutes } from './unProtected.route';
import { useCheckScopeEntityDefault } from '@/modules/common/hoc';
import { ROUTE_PATH, SCOPE_CONFIG } from '@/enums';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../redux/auth';

const Home = lazy(() => import('modules/dashboard/pages/Home'));
const Project = lazy(() => import('@pages/Project/Project'));
const Profile = lazy(() => import('@pages/Profile/Profile'));
const QuestionBank = lazy(
  () => import('modules/dashboard/pages/QuestionBank/QuestionBank'),
);
const ViewQuestion = lazy(
  () => import('@pages/QuestionBank/ViewQuestion/ViewQuestion'),
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

const ChangelogManagement = lazy(
  () => import('modules/dashboard/pages/ChangeLog/Changelog/ChangeLog'),
);

export const ScrollToTop = props => {
  const { scrollToTop } = useScrollbarContext();

  useEffect(() => {
    scrollToTop(0);
  }, [scrollToTop]);

  return props.children;
};

const AppRoutes = () => {
  const { canRead: canReadQuestion } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTION,
  );
  const isFetching = useSelector(AuthSelectors.getIsFetchingProfile);

  const canReadQuestionFinal = isFetching ? true : canReadQuestion;

  return (
    <ScrollToTop>
      <Suspense fallback={<CustomSpinSuspense />}>
        <Routes>
          <Route path={'/app'} element={<ProtectedRoutes />}>
            <Route index element={<Home />} />
            <Route
              path={ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + '/*'}
              element={<Project />}
            />
            <Route
              path={ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT}
              element={<Profile />}
            >
              <Route
                path={ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM}
                element={<Profile />}
              />
            </Route>
            {canReadQuestionFinal && (
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
            )}

            <Route
              path={ROUTE_PATH.DASHBOARD_PATHS.CHANGE_LOG.ROOT}
              element={<ChangelogManagement />}
            ></Route>
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
