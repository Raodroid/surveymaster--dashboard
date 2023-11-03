import { Route, Routes } from 'react-router';
import EditSurvey from './Edit';
import ActionHistory from './History';
import Remarks from './Remarks';
import { DetailSurveyWrapper } from './styles';
import ViewSurvey from './View';
import { ROUTE_PATH } from '@/enums';

export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

function DetailSurvey() {
  const subRoute = (route: string) =>
    route.replace(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, '');

  return (
    <DetailSurveyWrapper className="h-full flex flex-col">
      <Routes>
        <Route path="/" element={<ViewSurvey />} />
        <Route
          path={subRoute(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT)}
          element={<EditSurvey />}
        />
        <Route
          path={subRoute(
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.HISTORY,
          )}
          element={<ActionHistory />}
        />
        <Route
          path={subRoute(
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.REMARKS,
          )}
          element={<Remarks />}
        />
      </Routes>
    </DetailSurveyWrapper>
  );
}

export default DetailSurvey;
