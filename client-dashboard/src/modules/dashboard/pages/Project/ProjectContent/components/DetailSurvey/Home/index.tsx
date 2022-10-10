import { Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionList from './QuestionList';
import { DetailSurveyHomeWrapper } from './styles';

function DetailSurveyHome(props: DetailSurveyProps) {
  const { surveyData: survey } = props;
  const params = useParams();
  const { search } = useLocation();
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;

  const title = useMemo(
    () => search.replace('?projectName=', '').replace(/%20/g, ' '),
    [search],
  );

  const routes = useMemo(
    () => [
      {
        name: title,
        href:
          params &&
          params.id &&
          routePath.SURVEY.replace(':id', params.id) + `?projectName=${title}`,
      },
      {
        name: survey?.data.name,
        href: '',
      },
    ],
    [params, survey, routePath, title],
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
      ) + `?projectName=${title}`,
  ];

  const initialValue = useMemo(() => {
    console.log({
      ...survey?.data,
      createdAt: survey?.data.createdAt.slice(0, 10),
    });
    return (
      survey &&
      survey.data && {
        ...survey?.data,
        createdAt: survey?.data.createdAt.slice(0, 10),
      }
    );
  }, [survey]);

  return (
    <DetailSurveyHomeWrapper className="flex-column">
      <ProjectHeader routes={routes} links={links} />
      <CustomSpinSuspense spinning={!initialValue}>
        {initialValue && (
          <div className="body">
            <Formik initialValues={initialValue} onSubmit={() => {}}>
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
                  <QuestionList survey={survey?.data.surveyQuestions} />
                </Form>
              )}
            </Formik>
          </div>
        )}
      </CustomSpinSuspense>
    </DetailSurveyHomeWrapper>
  );
}

export default DetailSurveyHome;
