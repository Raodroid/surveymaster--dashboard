import { Divider, Form } from 'antd';
import { Formik } from 'formik';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { CustomSpinSuspense } from 'modules/common/styles';
import { projectRoutePath } from 'modules/dashboard/pages/Project/util';
import moment from 'moment';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import { projectSurveyParams } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import { useGetSurveyDetail } from '../utils';
import ActionsHistory from './ActionsHistory';
import QuestionList from './QuestionList';
import { ActionsHistoryContentWrapper, ActionsHistoryWrapper } from './styles';

function ActionHistory() {
  const params = useParams<projectSurveyParams>();
  const { project, survey, isSurveyLoading } = useGetSurveyDetail();

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.data.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params.projectId,
        }),
      },
      {
        name: survey?.data.name || '...',
        href: generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
          projectId: params.projectId,
          surveyId: params.surveyId,
        }),
      },
      {
        name: 'Action History',
        href: projectRoutePath.DETAIL_SURVEY.HISTORY,
      },
    ],
    [params, survey, project],
  );

  const initialValue = useMemo(() => {
    return {
      ...survey?.data,
      createdAt: moment(survey?.data?.createdAt).format('DD.MM'),
    };
  }, [survey]);

  const handleSubmit = () => {};

  return (
    <>
      <ProjectHeader routes={routes} />
      <ActionsHistoryWrapper>
        <CustomSpinSuspense spinning={isSurveyLoading}>
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
                  <Inputs disabled hideRemarks />
                  <ActionsHistoryContentWrapper>
                    <ActionsHistory />
                    <Divider type="vertical" className="divider" />
                    <QuestionList questions={survey?.data.questions} />
                  </ActionsHistoryContentWrapper>
                </SimpleBar>
              </Form>
            )}
          </Formik>
        </CustomSpinSuspense>
      </ActionsHistoryWrapper>
    </>
  );
}

export default ActionHistory;
