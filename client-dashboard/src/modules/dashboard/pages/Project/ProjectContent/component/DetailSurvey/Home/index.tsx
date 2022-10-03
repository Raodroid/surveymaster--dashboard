import { Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { mockSurveyList } from 'modules/dashboard/pages/Project/mockup';
import { useParams } from 'react-router';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionList from './QuestionList';
import { DetailSurveyHomeWrapper } from './styles';

function DetailSurveyHome() {
  const params = useParams();

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);

  const routes = [
    {
      name: project?.name,
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
            name: project?.name,
            createdAt: project?.createdAt.toString().slice(0, 15),
            id: project?.displayId,
            surveyRemarks: project?.remark,
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
