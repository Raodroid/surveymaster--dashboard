import React, { FC, useCallback, useMemo } from 'react';
import { Button, notification } from 'antd';
import { ControlledInput } from '../../../../../../../common';
import { INPUT_TYPES } from '../../../../../../../common/input/type';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { IPostSurveyBodyDto, ISurveyQuestionDto, QuestionType } from 'type';
import { transformEnumToOption, onError } from 'utils';
import QuestionSurveyList from '../QuestionSurveyList';
import { SURVEY_FORM_SCHEMA } from '../../../../../../../common/validate/validate';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from 'services';
import { ROUTE_PATH } from 'enums';
import { useNavigate } from 'react-router-dom';
import { SurveyFormWrapper } from './style';
import { useParams } from 'react-router';
import { TemplateOption } from '../../../../ProjectSider/SurveyTemplateOption';

export enum SurveyTemplateEnum {
  NEW = 'NEW',
  DUPLICATE = 'DUPLICATE',
  JSON = 'JSON',
}

export interface IAddSurveyFormValues extends IPostSurveyBodyDto {
  template: SurveyTemplateEnum;
  questions: Array<
    ISurveyQuestionDto & {
      type: QuestionType | string;
      category: string;
      id?: string;
      questionTitle: string;
    }
  >;
}

export const initNewQuestionOnAddSurveyForm = {
  questionVersionId: '',
  remark: '',
  type: '',
  category: '',
  questionTitle: '',
};

const baseInitialValues: IAddSurveyFormValues = {
  projectId: '',
  name: '',
  remark: '',
  questions: [],
  template: SurveyTemplateEnum.NEW,
};

const AddSurveyForm: FC = props => {
  const params = useParams<{ id?: string }>();
  const projectId = params.id || '';
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const initialValues = useMemo<IAddSurveyFormValues>(
    () => ({
      ...baseInitialValues,
      projectId,
    }),
    [projectId],
  );

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries('getProjects');
    notification.success({ message: t('common.createSuccess') });
    navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
  }, [navigate, queryClient, t]);

  const addSurveyMutation = useMutation(
    (data: IPostSurveyBodyDto) => {
      return SurveyService.createSurvey(data);
    },
    {
      onSuccess,
      onError,
    },
  );

  const duplicateSurveyMutation = useMutation(
    (data: IPostSurveyBodyDto) => {
      return SurveyService.duplicateSurvey(data);
    },
    {
      onSuccess,
      onError,
    },
  );

  const onSubmit = useCallback(
    async (values: IAddSurveyFormValues) => {
      const { questions, template, ...rest } = values;

      if (!values.projectId) {
        console.error('ProjectId is null');
        navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
      }

      const transformValue: IPostSurveyBodyDto = {
        ...rest,
      };

      if (values.template === SurveyTemplateEnum.DUPLICATE) {
        await duplicateSurveyMutation.mutateAsync(transformValue);
      }

      if (values.template === SurveyTemplateEnum.NEW) {
        transformValue.questions = questions.map((q, index) => ({
          questionVersionId: q.questionVersionId,
          sort: index + 1,
          remark: q.remark,
        }));
        await addSurveyMutation.mutateAsync(transformValue);
      }
    },
    [addSurveyMutation, duplicateSurveyMutation, navigate],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={SURVEY_FORM_SCHEMA}
      enableReinitialize={true}
    >
      {({ values, dirty, isValid, handleSubmit }) => (
        <SurveyFormWrapper layout="vertical" onFinish={handleSubmit as any}>
          <div className={'SurveyFormWrapper__survey-info'}>
            <div
              className={
                'SurveyFormWrapper__survey-info__survey-detail-section'
              }
            >
              <div className="title mainInfo">
                {t('common.mainInformation')}:
              </div>

              <ControlledInput
                inputType={INPUT_TYPES.SELECT}
                name={'template'}
                options={transformEnumToOption(SurveyTemplateEnum, type =>
                  t(`surveyTemplateEnum.${type}`),
                )}
                dropdownRender={TemplateOption}
              />
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                name="name"
                label={t('common.surveyTitle')}
              />
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                name="remark"
                label={t('common.surveyRemarks')}
              />
            </div>
            <div className="divider" />
            <div className={'SurveyFormWrapper__survey-info__params-section'}>
              <div className="title params">
                {t('common.surveyParameters')}:
              </div>
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                name="id"
                label="ID"
                disabled
              />
            </div>
          </div>
          <div className={'SurveyFormWrapper__question'}>
            {values?.template === SurveyTemplateEnum.NEW && (
              <QuestionSurveyList />
            )}
          </div>
          <Button
            style={{ width: '100%' }}
            type="primary"
            className="info-btn"
            htmlType="submit"
            disabled={!dirty || !isValid}
            loading={addSurveyMutation.isLoading}
          >
            {t('common.saveSurvey')}
          </Button>
        </SurveyFormWrapper>
      )}
    </Formik>
  );
};

export default AddSurveyForm;
