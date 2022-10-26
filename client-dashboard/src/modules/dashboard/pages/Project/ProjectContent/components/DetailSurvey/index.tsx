import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { Route, Routes, useParams } from 'react-router';
import { SurveyService } from 'services';
import { projectRoutePath, useGetProjectByIdQuery } from '../../../util';
import EditSurvey from './Edit';
import ActionHistory from './History';
import Remarks from './Remarks';
import { DetailSurveyWrapper } from './styles';
import { IProject } from '../../../../../../../type';
import { onError } from '../../../../../../../utils';
import ViewSurvey from './View';

export interface DetailSurveyProps {
  surveyData: AxiosResponse<any, any> | undefined;
  projectData: IProject;
}

export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

function DetailSurvey() {
  const params = useParams<projectSurveyParams>();
  const subRoute = (route: string) =>
    route.replace(projectRoutePath.DETAIL_SURVEY.ROOT, '');

  const { project } = useGetProjectByIdQuery(params.projectId);

  const { data: survey } = useQuery(
    ['getSurvey', params.surveyId],
    () => SurveyService.getSurveyById(params.surveyId),
    { refetchOnWindowFocus: false, onError },
  );

  return (
    <DetailSurveyWrapper className="flex-column">
      <Routes>
        <Route path="/" element={<ViewSurvey />} />
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
