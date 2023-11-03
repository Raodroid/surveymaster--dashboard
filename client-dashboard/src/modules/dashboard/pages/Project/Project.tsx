import { ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import { ProjectWrapper, ProjectContentWrapper } from './styles';
import { AddSurvey, DetailSurvey, SurveyManagement } from '@pages/Survey';
import { useCheckScopeEntityDefault } from '@/modules/common/hoc';

import {
  ProjectContent,
  ProjectSider,
  AddProject,
  EditProject,
} from '@pages/Project';

const { PROJECT } = ROUTE_PATH.DASHBOARD_PATHS;

const Project = () => {
  const subRoute = (route: string) => route.replace(PROJECT.ROOT, '');

  const { canRead: canReadSurvey } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEY,
  );

  const isFetching = useSelector(AuthSelectors.getIsFetchingProfile);
  const canReadSurveyinal = isFetching ? true : canReadSurvey;

  return (
    <ProjectWrapper>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ProjectSider />
              <ProjectContentWrapper>
                <Outlet />
              </ProjectContentWrapper>
            </>
          }
        >
          <Route path="/" element={<ProjectContent />} />
          {canReadSurveyinal && (
            <Route
              path={subRoute(PROJECT.SURVEY)}
              element={<SurveyManagement />}
            />
          )}
          {canReadSurveyinal && (
            <Route
              path={subRoute(PROJECT.ADD_NEW_SURVEY)}
              element={<AddSurvey />}
            />
          )}
          <Route
            path={subRoute(PROJECT.PROJECT.ADD)}
            element={<AddProject />}
          />
          <Route
            path={subRoute(PROJECT.PROJECT.EDIT)}
            element={<EditProject />}
          />
          <Route
            path={subRoute(PROJECT.DETAIL_SURVEY.ROOT + '/*')}
            element={<DetailSurvey />}
          />
          <Route path="*" element={<Navigate to={PROJECT.ROOT} />} />
        </Route>
      </Routes>
    </ProjectWrapper>
  );
};

export default Project;
