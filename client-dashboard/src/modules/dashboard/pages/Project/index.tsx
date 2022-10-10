import { ROUTE_PATH } from 'enums';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import ProjectContent from './ProjectContent';
import AddSurvey from './ProjectContent/components/AddSurvey';
import DetailSurvey from './ProjectContent/components/DetailSurvey';
import { AddProject, EditProject } from './ProjectContent/components/Project';
import Survey from './ProjectContent/components/Survey';
import { ProjectContentWrapper } from './ProjectContent/style';
import ProjectSider from './ProjectSider';
import { ProjectWrapper } from './style';

const Project = () => {
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
  const subRoute = (route: string) => route.replace(routePath.ROOT, '');

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

          <Route path={subRoute(routePath.SURVEY)} element={<Survey />} />
          <Route
            path={subRoute(routePath.ADD_NEW_SURVEY)}
            element={<AddSurvey />}
          />
          <Route
            path={subRoute(routePath.PROJECT.ADD)}
            element={<AddProject />}
          />
          <Route
            path={subRoute(routePath.PROJECT.EDIT)}
            element={<EditProject />}
          />
          <Route
            path={subRoute(routePath.DETAIL_SURVEY.ROOT + '/*')}
            element={<DetailSurvey />}
          />

          <Route path="*" element={<Navigate to={routePath.ROOT} />} />
        </Route>
      </Routes>
    </ProjectWrapper>
  );
};

export default Project;
