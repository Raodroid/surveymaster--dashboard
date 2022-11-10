import { Navigate, Outlet, Route, Routes } from 'react-router';
import ProjectContent from './ProjectContent';
import DetailSurvey from './ProjectContent/components/DetailSurvey';
import { AddProject, EditProject } from './ProjectContent/components/Project';
import Survey from './ProjectContent/components/Survey';
import { ProjectContentWrapper } from './ProjectContent/styles';
import ProjectSider from './ProjectSider';
import { ProjectWrapper } from './styles';
import { projectRoutePath } from './util';
import { useCheckScopeEntityDefault } from '../../../common/hoc';
import { SCOPE_CONFIG } from 'enums';
import AddSurvey from './ProjectContent/components/DetailSurvey/Add';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../../../../redux/auth';

const Project = () => {
  const subRoute = (route: string) => route.replace(projectRoutePath.ROOT, '');

  const { canRead: canReadSurvey } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEYS,
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
              element={<Survey />}
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
