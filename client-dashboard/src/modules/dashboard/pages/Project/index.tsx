import { ROUTE_PATH } from 'enums';
import { useQuery } from 'react-query';
import { Navigate, Route, Routes } from 'react-router';
import APIService from 'services/survey-master-service/base.service';
import ProjectContent from './ProjectContent';
import AddSurvey from './ProjectContent/component/AddSurvey';
import DetailSurvey from './ProjectContent/component/DetailSurvey';
import { AddProject, EditProject } from './ProjectContent/component/Project';
import Survey from './ProjectContent/component/Survey';
import { ProjectContentWrapper } from './ProjectContent/style';
import ProjectSider from './ProjectSider';
import { ProjectWrapper } from './style';

const Project = () => {
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
  const subRoute = (route: string) => route.replace(routePath.ROOT, '');

  const { data } = useQuery('data', () =>
    APIService.get('/projects', {
      params: {
        page: 1,
        take: 10,
        q: '',
        isDeleted: false,
      },
    }),
  );

  console.log(data);

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
        </Routes>
      </ProjectContentWrapper>
    </ProjectWrapper>
  );
};

export default Project;
