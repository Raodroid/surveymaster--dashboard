import { useQuery } from 'react-query';
import { Route, Routes, useParams } from 'react-router';
import { SurveyService } from 'services';
import { projectRoutePath } from '../../../util';
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
  const subRoute = (route: string) =>
    route.replace(projectRoutePath.DETAIL_SURVEY.ROOT, '');

  const { data: survey } = useQuery(
    ['getSurvey', params.detailId],
    () => SurveyService.getSurveyById(params.detailId),
    { refetchOnWindowFocus: false },
  );

  return (
    <DetailSurveyWrapper className="flex-column">
      <Routes>
        <Route path="/" element={<DetailSurveyHome surveyData={survey} />} />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.EDIT)}
          element={<EditSurvey surveyData={survey} />}
        />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.HISTORY)}
          element={<ActionHistory surveyData={survey} />}
        />
        <Route
          path={subRoute(projectRoutePath.DETAIL_SURVEY.REMARKS)}
          element={<Remarks surveyData={survey} />}
        />
      </Routes>
    </DetailSurveyWrapper>
  );
}

export default DetailSurvey;
