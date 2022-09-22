import { ROUTE_PATH } from 'enums';
import { Navigate, Route, Routes } from 'react-router';
import ProjectContent from './ProjectContent';
import AddSurvey from './ProjectContent/component/AddSurvey';
import DonorV2 from './ProjectContent/component/DonorV2';
import ProjectHeader from './ProjectContent/component/Header';
import AddProject from './ProjectContent/component/NewProject';
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
            path={subRoute(routePath.ADD_NEW_SURVEY)}
            element={<AddSurvey />}
          />
          <Route
            path={subRoute(routePath.ADD_NEW_PROJECT)}
            element={<AddProject />}
          />
          <Route path={subRoute(routePath.DONOR_V2)} element={<DonorV2 />} />

          <Route path="*" element={<Navigate to={ROUTE_PATH.HOME} />} />
        </Routes>
      </ProjectContentWrapper>
    </ProjectWrapper>
  );
};

export default Project;
