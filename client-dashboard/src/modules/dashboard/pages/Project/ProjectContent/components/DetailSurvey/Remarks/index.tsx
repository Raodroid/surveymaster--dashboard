import { Button, Form, notification } from 'antd';
import { Formik } from 'formik';
import { UpdateSurvey } from 'interfaces';
import { CustomSpinSuspense } from 'modules/common/styles';
import {
  createProjectDetailLink,
  createProjectLink,
  getProjectTitle,
  projectRoutePath,
} from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import { SurveyService } from 'services';
import SimpleBar from 'simplebar-react';
import { onError } from 'utils';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionRemarks from './QuestionRemarks';
import { RemarksWrapper } from './styles';

export interface IQuestions {
  questionVersionId: string;
  remark: string;
  sort: number;
  id: string;
}
export interface IUpdateSurvey {
  id: string;
  name: string;
  remark: string;
  surveyQuestions: IQuestions[];
  projectId: string;
}

function Remarks(props: DetailSurveyProps) {
  const { surveyData: survey } = props;
  const params = useParams();
  const { search } = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        href:
          params &&
          params.id &&
          params.detailId &&
          createProjectDetailLink(
            projectRoutePath.DETAIL_SURVEY.ROOT,
            params.id,
            params.detailId,
            title,
          ),
      },
      {
        name: 'Remarks',
        href: '',
      },
    ],
    [params, survey, title],
  );

  const mutationUpdateRemarks = useMutation(
    (payload: UpdateSurvey) => SurveyService.updateSurvey(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getSurvey');
        notification.success({ message: t('common.updateSuccess') });
        if (params.id && params.detailId)
          navigate(
            createProjectDetailLink(
              projectRoutePath.DETAIL_SURVEY.ROOT,
              params.id,
              params.detailId,
              title,
            ),
          );
      },
      onError,
    },
  );

  const handleSubmit = (payload: IUpdateSurvey) => {
    const updateSurveyPayload = {
      id: payload.id,
      projectId: payload.projectId,
      questions: payload.surveyQuestions.map((elm: IQuestions) => {
        return {
          id: elm.id,
          questionVersionId: elm.questionVersionId,
          remark: elm.remark,
          sort: elm.sort,
        };
      }),
      name: payload.name,
      remark: payload.remark,
    };
    mutationUpdateRemarks.mutateAsync(updateSurveyPayload);
  };

  const initialValues = useMemo(() => survey?.data, [survey]);

  return (
    <>
      <ProjectHeader routes={routes} />

      <RemarksWrapper className="height-100 overflow-hidden">
        <CustomSpinSuspense spinning={!initialValues}>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit: handleFinish,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form
                layout="vertical"
                onFinish={handleFinish}
                className="height-100"
              >
                <SimpleBar style={{ height: 'calc(100% - 76px)' }}>
                  <Inputs remarks />
                  <QuestionRemarks questions={survey?.data.surveyQuestions} />
                </SimpleBar>
                <div className="footer flex-center">
                  <Button
                    type="primary"
                    className="info-btn"
                    htmlType="submit"
                    loading={mutationUpdateRemarks.isLoading}
                  >
                    {t('common.saveProject')}
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
