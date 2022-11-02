import { Navigate, Outlet, Route, Routes } from 'react-router';
import ProjectContent from './ProjectContent';
import AddSurvey from './ProjectContent/components/DetailSurvey/Add';
import DetailSurvey from './ProjectContent/components/DetailSurvey';
import { AddProject, EditProject } from './ProjectContent/components/Project';
import Survey from './ProjectContent/components/Survey';
import { ProjectContentWrapper } from './ProjectContent/styles';
import ProjectSider from './ProjectSider';
import { ProjectWrapper } from './styles';
import { projectRoutePath } from './util';
import { useCheckScopeEntityDefault } from '../../../common/hoc';
import { SCOPE_CONFIG } from 'enums';

const Project = () => {
  const subRoute = (route: string) => route.replace(projectRoutePath.ROOT, '');

  const { canRead: canReadSurvey } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEYS,
  );

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
          {canReadSurvey && (
            <Route
              path={subRoute(projectRoutePath.SURVEY)}
              element={<Survey />}
            />
          )}
          {canReadSurvey && (
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
