import { ROUTE_PATH } from 'enums';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { Route, Routes } from 'react-router';
import { ProjectService } from 'services';
import EditSurvey from './Edit';
import ActionHistory from './History';
import DetailSurveyHome from './Home';
import Remarks from './Remarks';
import { DetailSurveyWrapper } from './styles';

export interface DetailSurveyProps {
  surveyData: any;
}

function DetailSurvey() {
  const params = useParams();

  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY;
  const subRoute = (route: string) => route.replace(routePath.ROOT, '');

  const { data: survey } = useQuery(
    ['survey', params.detailId],
    () => ProjectService.getSurveyById(params.detailId),
    { refetchOnWindowFocus: false },
  );

  return (
    <DetailSurveyWrapper className="flex-column">
      <Routes>
        <Route path="/" element={<DetailSurveyHome surveyData={survey} />} />
        <Route path={subRoute(routePath.EDIT)} element={<EditSurvey />} />
        <Route path={subRoute(routePath.HISTORY)} element={<ActionHistory />} />
        <Route
          path={subRoute(routePath.REMARKS)}
          element={<Remarks surveyData={survey} />}
        />
      </Routes>
    </DetailSurveyWrapper>
  );
}

export default DetailSurvey;
