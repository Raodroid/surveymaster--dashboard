import { ROUTE_PATH } from 'enums';
import { Navigate, Route, Routes } from 'react-router';
import ProjectContent from './ProjectContent';
import ProjectHeader from './ProjectContent/component/Header';
import Survey from './ProjectContent/component/Survey';
import { ProjectContentWrapper } from './ProjectContent/style';
import ProjectSider from './ProjectSider';
import { ProjectWrapper } from './style';

const Project = () => {
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
  const subRoute = (route: string) => route.replace(routePath.HOME, '');

  return (
    <ProjectWrapper>
      <ProjectSider />
      <ProjectContentWrapper>
        <Routes>
          <Route path="/" element={<ProjectContent />} />

          <Route path={subRoute(routePath.SURVEY)} element={<Survey />} />
          <Route
            path={subRoute(routePath.SURVEY_LIST)}
            element={<ProjectContent />}
          />
          <Route
            path={subRoute(routePath.ADD_NEW_SURVEY)}
            element={<ProjectContent />}
          />

          <Route path="*" element={<Navigate to={ROUTE_PATH.HOME} />} />
        </Routes>
      </ProjectContentWrapper>
    </ProjectWrapper>
  );
};

export default Project;
