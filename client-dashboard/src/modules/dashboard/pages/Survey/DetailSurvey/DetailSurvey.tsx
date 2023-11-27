import { Route, Routes } from 'react-router';
import ActionHistory from './History';
import { ROUTE_PATH } from '@/enums';
import { SurveyForm } from '@pages/Survey';

export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

function DetailSurvey() {
  const subRoute = (route: string) =>
    route.replace(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, '');

  return (
    <Routes>
      <Route path="/" element={<SurveyForm />} />
      <Route
        path={subRoute(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT)}
        element={<SurveyForm />}
      />
      <Route
        path={subRoute(
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.HISTORY,
        )}
        element={<ActionHistory />}
      />
    </Routes>
  );
}

export default DetailSurvey;
