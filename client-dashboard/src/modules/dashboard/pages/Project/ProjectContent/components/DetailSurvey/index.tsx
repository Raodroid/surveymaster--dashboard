import { AxiosResponse } from 'axios';
import { Route, Routes } from 'react-router';
import { IProject } from '../../../../../../../type';
import { projectRoutePath } from '../../../util';
import EditSurvey from './Edit';
import ActionHistory from './History';
import Remarks from './Remarks';
import { DetailSurveyWrapper } from './styles';
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
  const subRoute = (route: string) =>
    route.replace(projectRoutePath.DETAIL_SURVEY.ROOT, '');

  return (
    <DetailSurveyWrapper className="flex-column">
      <Routes>
        <Route path="/" element={<ViewSurvey />} />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.EDIT)}
          element={<EditSurvey />}
        />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.HISTORY)}
          element={<ActionHistory />}
        />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.REMARKS)}
          element={<Remarks />}
        />
      </Routes>
    </DetailSurveyWrapper>
  );
}

export default DetailSurvey;
