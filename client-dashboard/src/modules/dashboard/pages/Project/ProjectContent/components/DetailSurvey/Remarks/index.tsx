import { Button, Form, notification } from 'antd';
import { Formik } from 'formik';
import { UpdateSurvey } from 'interfaces';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { CustomSpinSuspense } from 'modules/common/styles';
import { projectRoutePath } from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import { SurveyService } from 'services';
import SimpleBar from 'simplebar-react';
import { onError } from 'utils';
import { DetailSurveyProps, projectSurveyParams } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionRemarks from './QuestionRemarks';
import { RemarksWrapper } from './styles';
interface IQuestions {
  questionVersionId: string;
  remark: string;
  sort: number;
  id: string;
}
export interface IUpdateSurvey {
  id: string;
  name: string;
  remark: string;
  questions: IQuestions[];
  projectId: string;
}

function Remarks(props: DetailSurveyProps) {
  const { surveyData: survey, projectData: project } = props;
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.data.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: survey?.data.name || '...',
        href: generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
          projectId: params?.projectId,
          surveyId: params?.surveyId,
        }),
      },
      {
        name: 'Remarks',
        href: projectRoutePath.DETAIL_SURVEY.REMARKS,
      },
    ],
    [params, survey, project],
  );

  const mutationUpdateRemarks = useMutation(
    (payload: UpdateSurvey) => SurveyService.updateSurvey(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getSurvey');
        notification.success({ message: t('common.updateSuccess') });
        navigate(
          generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
            projectId: params?.projectId,
            surveyId: params?.surveyId,
          }),
        );
      },
      onError,
    },
  );

  const handleSubmit = (payload: IUpdateSurvey) => {
    const updateSurveyPayload = {
      id: payload.id,
      projectId: payload.projectId,
      questions: payload.questions.map((elm: IQuestions) => {
        return {
          id: elm.id,
          questionVersionId: elm.questionVersionId,
          remark: elm.remark,
          sort: elm.sort,
          surveyId: params.surveyId || '',
        };
      }),
      name: payload.name,
      remark: payload.remark,
    };
    mutationUpdateRemarks.mutateAsync(updateSurveyPayload);
  };

  return (
    <>
      <ProjectHeader routes={routes} />

      <RemarksWrapper className="height-100 overflow-hidden">
        <CustomSpinSuspense spinning={!survey?.data}>
          <Formik
            enableReinitialize={true}
            initialValues={survey?.data}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit: handleFinish }) => (
              <Form
                layout="vertical"
                onFinish={handleFinish}
                className="height-100"
              >
                <SimpleBar style={{ height: 'calc(100% - 76px)' }}>
                  <Inputs remarks />
                  <QuestionRemarks questions={survey?.data.questions} />
                </SimpleBar>
                <div className="footer flex-center">
                  <Button
                    type="primary"
                    className="info-btn"
                    htmlType="submit"
                    loading={mutationUpdateRemarks.isLoading}
                  >
                    {t('common.saveRemarks')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CustomSpinSuspense>
      </RemarksWrapper>
    </>
  );
}

export default Remarks;
