import { Button, Form, notification } from 'antd';
import { Formik } from 'formik';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { CustomSpinSuspense } from 'modules/common/styles';
import {
  projectRoutePath,
  useGetProjectByIdQuery,
} from 'modules/dashboard/pages/Project/util';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { generatePath, useParams } from 'react-router';
import { SurveyService } from 'services';
import SimpleBar from 'simplebar-react';
import { IPostSurveyBodyDto, ISurvey } from 'type';
import { onError } from 'utils';
import { projectSurveyParams } from '..';
import { SurveyQuestionDto } from '../../../../../../../../interfaces';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import { useGetSurveyDetail } from '../utils';
import QuestionRemarks from './QuestionRemarks';
import { RemarksWrapper } from './styles';
import { useNavigate } from 'react-router-dom';
import { useGetSurveyById } from '../../Survey/util';
import moment from 'moment';
import { MOMENT_FORMAT } from '../../../../../../../../enums';

function Remarks() {
  const params = useParams<projectSurveyParams>();
  const { surveyData: survey } = useGetSurveyById(params.surveyId);
  const { project } = useGetProjectByIdQuery(params.projectId);

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { project, survey, isSurveyLoading } = useGetSurveyDetail();

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: survey?.name || '...',
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
    (payload: IPostSurveyBodyDto) => SurveyService.updateSurvey(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getSurveyById');
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

  const handleSubmit = useCallback(
    (payload: ISurvey) => {
      const updateSurveyPayload = {
        surveyId: payload.id,
        projectId: payload.projectId,
        questions: payload?.questions?.map(elm => {
          return {
            questionVersionId: elm.questionVersionId,
            remark: elm.remark,
            sort: elm.sort,
            surveyId: params.surveyId,
            parameter: elm.parameter,
          };
        }),
        name: payload.name,
        remark: payload.remark,
      };
      mutationUpdateRemarks.mutateAsync(updateSurveyPayload);
    },
    [mutationUpdateRemarks, params.surveyId],
  );

  const initialValue = useMemo<ISurvey>(() => {
    return {
      ...survey,
      createdAt: moment(survey?.createdAt).format(
        MOMENT_FORMAT.FULL_DATE_FORMAT,
      ),
    };
  }, [survey]);

  return (
    <>
      <ProjectHeader routes={routes} />

      <RemarksWrapper className="height-100 overflow-hidden">
        <CustomSpinSuspense spinning={isSurveyLoading}>
          <Formik
            enableReinitialize={true}
            initialValues={initialValue}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <Form
                layout="vertical"
                onFinish={handleSubmit}
                className="height-100"
              >
                <SimpleBar style={{ height: 'calc(100% - 76px)' }}>
                  <Inputs hideDate />
                  <QuestionRemarks />
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
