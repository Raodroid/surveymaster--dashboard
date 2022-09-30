import { Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { useParams } from 'react-router';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionList from './QuestionList';
import { DetailSurveyHomeWrapper } from './styles';

function DetailSurveyHome() {
  const params = useParams();
  const routes = [
    {
      name: params.id,
      href:
        params &&
        params.id &&
        ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', params.id),
    },
    {
      name: params.detailId,
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY.replace(
        ':id',
        params.id || '',
      ),
    },
  ];

  return (
    <DetailSurveyHomeWrapper className="flex-column">
      <ProjectHeader routes={routes} />
      <div className="body">
        <Formik
          initialValues={{
            surveyTitle: 'Month Survey',
            dateCreated: '20.03.2022',
            id: '113-2121',
            surveyRemarks:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inore magna aliqua.',
          }}
          onSubmit={() => {}}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form layout="vertical">
              <Inputs />
              <QuestionList />
            </Form>
          )}
        </Formik>
      </div>
    </DetailSurveyHomeWrapper>
  );
}

export default DetailSurveyHome;
