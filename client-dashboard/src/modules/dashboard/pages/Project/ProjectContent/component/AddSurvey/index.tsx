import { ROUTE_PATH } from 'enums';
import { useParams } from 'react-router';
import ProjectHeader from '../Header';
import { AddSurveyWrapper } from './styles';
import { mockSurveyList } from '../../../../../../../type';
import AddSurveyForm from './AddSurveyForm/AddSurveyForm';

function AddSurvey() {
  const params = useParams();

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);

  const routes = [
    {
      name: project?.name,
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + '/' + params.id,
    },
    {
      name: 'Add New Survey',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY.replace(
        ':id',
        params.id || '',
      ),
    },
  ];

  return (
    <>
      <ProjectHeader routes={routes} />

      <AddSurveyWrapper>
        <AddSurveyForm />
      </AddSurveyWrapper>
    </>
  );
}

export default AddSurvey;
