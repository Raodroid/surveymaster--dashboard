import { SCOPE_CONFIG } from 'enums';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import ProjectContent from './ProjectContent/ProjectContent';
import { ProjectContentWrapper } from './ProjectContent/styles';
import ProjectSider from './ProjectSider/ProjectSider';
import { ProjectWrapper } from './styles';
import { projectRoutePath } from './util';
import { AddSurvey, DetailSurvey, SurveyManagement } from '@pages/Survey';
import { useCheckScopeEntityDefault } from '@/modules/common/hoc';
import {
  AddProject,
  EditProject,
} from '@pages/Project/ProjectContent/components/Project';

const Project = () => {
  const subRoute = (route: string) => route.replace(projectRoutePath.ROOT, '');

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
              path={subRoute(projectRoutePath.SURVEY)}
              element={<SurveyManagement />}
            />
          )}
          {canReadSurveyinal && (
            <Route
              path={subRoute(projectRoutePath.ADD_NEW_SURVEY)}
              element={<AddSurvey />}
            />
          )}
          <Route
            path={subRoute(projectRoutePath.PROJECT.ADD)}
            element={<AddProject />}
          />
          <Route
            path={subRoute(projectRoutePath.PROJECT.EDIT)}
            element={<EditProject />}
          />
          <Route
            path={subRoute(projectRoutePath.DETAIL_SURVEY.ROOT + '/*')}
            element={<DetailSurvey />}
          />
          <Route path="*" element={<Navigate to={projectRoutePath.ROOT} />} />
        </Route>
      </Routes>
    </ProjectWrapper>
  );
};

export default Project;
