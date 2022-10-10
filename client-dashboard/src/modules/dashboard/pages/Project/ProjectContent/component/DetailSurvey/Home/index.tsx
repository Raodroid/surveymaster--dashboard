import { Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { mockSurveyList } from 'type';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionList from './QuestionList';
import { DetailSurveyHomeWrapper } from './styles';

function DetailSurveyHome() {
  const params = useParams();
  const { data } = mockSurveyList;
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
  const project = data.find(elm => elm.project?.displayId === params.id);
  const survey = data.find(elm => elm.displayId === params.detailId);

  const routes = useMemo(
    () => [
      {
        name: project?.name,
        href:
          params &&
          params.id &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', params.id),
      },
      {
        name: survey?.project?.name,
        href: '',
      },
    ],
    [params, project, survey],
  );

  const links = [
    params &&
      params.id &&
      params.detailId &&
      routePath.DETAIL_SURVEY.EDIT.replace(':id', params.id).replace(
        ':detailId',
        params.detailId,
      ),
    params &&
      params.id &&
      params.detailId &&
      routePath.DETAIL_SURVEY.HISTORY.replace(':id', params.id).replace(
        ':detailId',
        params.detailId,
      ),
    params &&
      params.id &&
      params.detailId &&
      routePath.DETAIL_SURVEY.REMARKS.replace(':id', params.id).replace(
        ':detailId',
        params.detailId,
      ),
  ];

  return (
    <DetailSurveyHomeWrapper className="flex-column">
      <ProjectHeader routes={routes} links={links} />
      <div className="body">
        <Formik
          initialValues={{
            name: survey?.project?.name,
            createdAt: survey?.createdAt.toString().slice(0, 15),
            id: survey?.displayId,
            surveyRemarks: survey?.remark,
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
              <Inputs disabled />
              <QuestionList survey={project} />
            </Form>
          )}
        </Formik>
      </div>
    </DetailSurveyHomeWrapper>
  );
}

export default DetailSurveyHome;
