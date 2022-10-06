import { ROUTE_PATH } from 'enums';
import { Route, Routes } from 'react-router';
import EditSurvey from './Edit';
import ActionHistory from './History';
import DetailSurveyHome from './Home';
import Remarks from './Remarks';
import { DetailSurveyWrapper } from './styles';

function DetailSurvey() {
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY;
  const subRoute = (route: string) => route.replace(routePath.ROOT, '');

  return (
    <DetailSurveyWrapper className="flex-column">
      <Routes>
        <Route path="/" element={<DetailSurveyHome />} />
        <Route path={subRoute(routePath.EDIT)} element={<EditSurvey />} />
        <Route path={subRoute(routePath.HISTORY)} element={<ActionHistory />} />
        <Route path={subRoute(routePath.REMARKS)} element={<Remarks />} />
      </Routes>
    </DetailSurveyWrapper>
  );
}

export default DetailSurvey;
