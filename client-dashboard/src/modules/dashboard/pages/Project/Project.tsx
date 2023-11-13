import { ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import { ProjectContentWrapper } from './styles';
import { AddSurvey, DetailSurvey, SurveyManagement } from '@pages/Survey';
import { useCheckScopeEntityDefault } from '@/modules/common/hoc';

import { ProjectContent, AddProject, EditProject } from '@pages/Project';
import { Layout } from 'antd';
import Body from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Layout';

const { Content } = Layout;

const { PROJECT } = ROUTE_PATH.DASHBOARD_PATHS;
const subRoute = (route: string) => route.replace(PROJECT.ROOT, '');

const Project = () => {
  const { canRead: canReadSurvey } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEY,
  );

  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECT);
  const isFetching = useSelector(AuthSelectors.getIsFetchingProfile);
  const canReadSurveyinal = isFetching ? true : canReadSurvey;

  return (
    <Content>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ProjectContentWrapper>
                <Outlet />
              </ProjectContentWrapper>
            </>
          }
        >
          {canRead && <Route path="/" element={<ProjectContent />} />}
          <Route
            path={subRoute(PROJECT.DETAIL_SURVEY.TEST)}
            element={<Body />}
          />
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
    </Content>
  );
};

export default Project;
