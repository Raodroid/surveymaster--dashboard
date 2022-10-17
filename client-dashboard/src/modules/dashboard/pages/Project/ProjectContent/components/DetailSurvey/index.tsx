import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { Route, Routes, useParams } from 'react-router';
import { ProjectService, SurveyService } from 'services';
import { projectRoutePath } from '../../../util';
import EditSurvey from './Edit';
import ActionHistory from './History';
import DetailSurveyHome from './Home';
import Remarks from './Remarks';
import { DetailSurveyWrapper } from './styles';

export interface DetailSurveyProps {
  surveyData: AxiosResponse<any, any> | undefined;
  projectData: AxiosResponse<any, any> | undefined;
}

export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

function DetailSurvey() {
  const params = useParams<projectSurveyParams>();
  const subRoute = (route: string) =>
    route.replace(projectRoutePath.DETAIL_SURVEY.ROOT, '');

  const { data: project } = useQuery(
    ['getProject', params.projectId],
    () => ProjectService.getProjectById(params.projectId),
    { refetchOnWindowFocus: false },
  );

  const { data: survey } = useQuery(
    ['getSurvey', params.surveyId],
    () => SurveyService.getSurveyById(params.surveyId),
    { refetchOnWindowFocus: false },
  );

  return (
    <DetailSurveyWrapper className="flex-column">
      <Routes>
        <Route
          path="/"
          element={
            <DetailSurveyHome surveyData={survey} projectData={project} />
          }
        />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.EDIT)}
          element={<EditSurvey surveyData={survey} projectData={project} />}
        />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.HISTORY)}
          element={<ActionHistory surveyData={survey} projectData={project} />}
        />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.REMARKS)}
          element={<Remarks surveyData={survey} projectData={project} />}
        />
      </Routes>
    </DetailSurveyWrapper>
  );
}

export default DetailSurvey;
