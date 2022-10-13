import { Form } from 'antd';
import { Formik } from 'formik';
import { CustomSpinSuspense } from 'modules/common/styles';
import {
  getProjectTitle,
  projectRoutePath,
} from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { generatePath, useLocation, useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionList from './QuestionList';
import { DetailSurveyHomeWrapper } from './styles';

function DetailSurveyHome(props: DetailSurveyProps) {
  const { surveyData: survey } = props;
  const params = useParams();
  const { search } = useLocation();

  const title = useMemo(() => getProjectTitle(search), [search]);

  const routes = useMemo(
    () => [
      {
        name: title,
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.id,
        }),
      },
      {
        name: survey?.data.name,
        href: projectRoutePath.DETAIL_SURVEY.ROOT,
      },
    ],
    [params, survey, title],
  );

  const links = [
    generatePath(projectRoutePath.DETAIL_SURVEY.EDIT, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),

    generatePath(projectRoutePath.DETAIL_SURVEY.HISTORY, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),

    generatePath(projectRoutePath.DETAIL_SURVEY.REMARKS, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),
  ];

  const initialValue = useMemo(() => {
    return {
      ...survey?.data,
      createdAt: survey?.data?.createdAt?.slice(0, 10),
    };
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
