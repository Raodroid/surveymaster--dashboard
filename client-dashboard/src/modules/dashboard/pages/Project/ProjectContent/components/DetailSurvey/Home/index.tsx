import { Form } from 'antd';
import { Formik } from 'formik';
import { CustomSpinSuspense } from 'modules/common/styles';
import {
  createProjectDetailLink,
  createProjectLink,
  getProjectTitle,
  projectRoutePath,
} from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionList from './QuestionList';
import { DetailSurveyHomeWrapper } from './styles';
import SimpleBar from 'simplebar-react';

function DetailSurveyHome(props: DetailSurveyProps) {
  const { surveyData: survey } = props;
  const params = useParams();
  const { search } = useLocation();
  const location = useLocation();

  console.log(location, params);

  const title = useMemo(() => getProjectTitle(search), [search]);

  const routes = useMemo(
    () => [
      {
        name: title,
        href:
          params &&
          params.id &&
          createProjectLink(projectRoutePath.SURVEY, params.id, title),
      },
      {
        name: survey?.data.name,
        href: '',
      },
    ],
    [params, survey, title],
  );

  const links = [
    params &&
      params.id &&
      params.detailId &&
      createProjectDetailLink(
        projectRoutePath.DETAIL_SURVEY.EDIT,
        params.id,
        params.detailId,
        title,
      ),
    params &&
      params.id &&
      params.detailId &&
      createProjectDetailLink(
        projectRoutePath.DETAIL_SURVEY.HISTORY,
        params.id,
        params.detailId,
        title,
      ),
    params &&
      params.id &&
      params.detailId &&
      createProjectDetailLink(
        projectRoutePath.DETAIL_SURVEY.REMARKS,
        params.id,
        params.detailId,
        title,
      ),
  ];

  const initialValue = useMemo(() => {
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
          <div className="body height-100">
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
                <Form layout="vertical" className="height-100">
                  <SimpleBar style={{ height: '100%' }}>
                    <Inputs disabled />
                    <QuestionList survey={survey?.data.surveyQuestions} />
                  </SimpleBar>
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
