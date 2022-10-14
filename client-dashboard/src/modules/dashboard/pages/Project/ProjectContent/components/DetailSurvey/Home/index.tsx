import { Form } from 'antd';
import { Formik } from 'formik';
import { CustomSpinSuspense } from 'modules/common/styles';
import { projectRoutePath } from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import { DetailSurveyProps, projectSurveyParams } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionList from './QuestionList';
import { DetailSurveyHomeWrapper } from './styles';

function DetailSurveyHome(props: DetailSurveyProps) {
  const { surveyData: survey, projectData: project } = props;
  const params = useParams<projectSurveyParams>();

  const routes = useMemo(
    () => [
      {
        name: project?.data.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: survey?.data.name || '...',
        href: projectRoutePath.DETAIL_SURVEY.ROOT,
      },
    ],
    [params, survey, project],
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

  const handleSubmit = () => {};

  return (
    <DetailSurveyHomeWrapper className="flex-column">
      <ProjectHeader routes={routes} links={links} />
      <CustomSpinSuspense spinning={!survey}>
        <div className="body height-100">
          <Formik
            initialValues={initialValue}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ handleSubmit: handleFinish }) => (
              <Form
                layout="vertical"
                className="height-100"
                onFinish={handleFinish}
              >
                <SimpleBar style={{ height: '100%' }}>
                  <Inputs disabled />
                  <QuestionList survey={survey?.data.questions} />
                </SimpleBar>
              </Form>
            )}
          </Formik>
        </div>
      </CustomSpinSuspense>
    </DetailSurveyHomeWrapper>
  );
}

export default DetailSurveyHome;
