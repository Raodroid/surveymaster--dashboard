import React, { FC, useCallback, useMemo, useRef } from 'react';
import { Button, notification } from 'antd';
import { ControlledInput } from '../../../../../../../common';
import { INPUT_TYPES } from '../../../../../../../common/input/type';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  IPostSurveyBodyDto,
  IQuestionVersion,
  ISurvey,
  ISurveyQuestionDto,
  QuestionType,
} from 'type';
import { transformEnumToOption, onError } from 'utils';
import { SURVEY_FORM_SCHEMA } from '../../../../../../../common/validate/validate';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from 'services';
import { ROUTE_PATH } from 'enums';
import { useMatch, useNavigate } from 'react-router-dom';
import { QuestionListWrapper, SurveyFormWrapper } from './style';
import { generatePath, useParams } from 'react-router';
import { TemplateOption } from './SurveyTemplateOption';
import DisplayQuestionSurveyList from './DisplayQuestionSurveyList';
import { useGetSurveyById } from '../../Survey/util';
import HannahCustomSpin from '../../../../../../components/HannahCustomSpin';

export enum SurveyTemplateEnum {
  NEW = 'NEW',
  DUPLICATE = 'DUPLICATE',
  JSON = 'JSON',
}

export type questionValueType = ISurveyQuestionDto & {
  type: QuestionType | string;
  category: string;
  id?: string;
  questionTitle: string;
  versions?: IQuestionVersion[];
};

export interface IAddSurveyFormValues extends IPostSurveyBodyDto {
  template: SurveyTemplateEnum;
  questions: questionValueType[];
  questionIdMap?: Record<
    string,
    { questionTitle: string; versions: IQuestionVersion[] } // object of { [questionVersionId] : {questionTitle: string, versions: version.id[]}}
  >;
}

export const initNewQuestionOnAddSurveyForm = {
  questionVersionId: '',
  remark: '',
  type: '',
  category: '',
  questionTitle: '',
};

const transformQuestionData = (
  input: ISurvey,
): questionValueType[] | undefined => {
  if (!input?.questions) return undefined;

  const { questions } = input;

  return questions?.map(q => ({
    questionTitle: q.questionVersion?.title as string,
    type: q.questionVersion?.type as string,
    remark: q.remark as string,
    questionVersionId: q.questionVersionId,
    id: q.questionVersion?.questionId,
    versions: q.questionVersion?.question?.versions,
    category: q.questionVersion?.question?.masterCategory?.name as string,
  }));
};

const createQuestionMap = (
  input: ISurvey,
):
  | Record<
      string,
      { questionTitle: string; versions: IQuestionVersion[] } // object of { [questionVersionId] : {questionTitle: string, versions: version.id[]}}
    >
  | undefined => {
  if (!input?.questions) return undefined;

  const { questions } = input;

  return questions?.reduce((res, q) => {
    if (!q.questionVersion?.question?.versions) {
      return res;
    }

    return {
      ...res,
      [q.questionVersionId]: {
        questionTitle: q.questionVersion.title,
        versions: q.questionVersion.question.versions,
      },
    };
  }, {});
};

const SurveyForm: FC = () => {
  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const projectId = params.projectId || '';
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { surveyData, isLoading } = useGetSurveyById(params?.surveyId);

  const initialValues = useMemo<IAddSurveyFormValues>(
    () => ({
      surveyId: surveyData?.id || '',
      name: surveyData?.name || '',
      template: SurveyTemplateEnum.NEW,
      remark: surveyData?.remark || '',
      questions: transformQuestionData(surveyData) || [],
      questionIdMap: createQuestionMap(surveyData),
      projectId,
    }),
    [projectId, surveyData],
  );
  const editRouteMath = useMatch(
    ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
  );

  const isEditMode = !!editRouteMath;

  const onSuccess = useCallback(
    async res => {
      await queryClient.invalidateQueries('getProjects');
      await queryClient.invalidateQueries('getSurveyById');
      notification.success({
        message: t(`common.${isEditMode ? 'updateSuccess' : 'createSuccess'}`),
      });
      navigate(
        generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
          projectId: params.projectId,
          surveyId: res.data.id,
        }),
      );
    },
    [isEditMode, navigate, params, queryClient, t],
  );

  const addSurveyMutation = useMutation(
    (data: IPostSurveyBodyDto) => {
      return SurveyService.createSurvey(data);
    },
    {
      onSuccess,
      onError,
    },
  );

  const updateSurveyMutation = useMutation(
    (data: IPostSurveyBodyDto) => {
      return SurveyService.updateSurvey(data);
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

      if (isEditMode) {
        transformValue.questions = questions.map((q, index) => ({
          questionVersionId: q.questionVersionId,
          sort: index + 1,
          remark: q.remark,
        }));
        await updateSurveyMutation.mutateAsync(transformValue);
      }

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
    [
      addSurveyMutation,
      duplicateSurveyMutation,
      isEditMode,
      navigate,
      updateSurveyMutation,
    ],
  );

  const wrapperRef = useRef<any>();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={SURVEY_FORM_SCHEMA}
      enableReinitialize={true}
    >
      {({ values, dirty, isValid, handleSubmit }) => (
        <SurveyFormWrapper
          layout="vertical"
          onFinish={handleSubmit as any}
          ref={wrapperRef}
        >
          <div className={'SurveyFormWrapper__survey-info'}>
            <div
              className={
                'SurveyFormWrapper__survey-info__survey-detail-section'
              }
            >
              <div className="title mainInfo">
                {t('common.mainInformation')}:
              </div>

              {!isEditMode && (
                <ControlledInput
                  inputType={INPUT_TYPES.SELECT}
                  name={'template'}
                  options={transformEnumToOption(SurveyTemplateEnum, type =>
                    t(`surveyTemplateEnum.${type}`),
                  )}
                  dropdownRender={TemplateOption}
                />
              )}
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
                name="surveyId"
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
          <div className={'SurveyFormWrapper__submit_btn'}>
            <Button
              type="primary"
              className="info-btn"
              htmlType="submit"
              disabled={!isValid}
              loading={
                addSurveyMutation.isLoading || updateSurveyMutation.isLoading
              }
            >
              {t('common.saveSurvey')}
            </Button>
          </div>
          <HannahCustomSpin parentRef={wrapperRef} spinning={isLoading} />
        </SurveyFormWrapper>
      )}
    </Formik>
  );
};

export default SurveyForm;

function QuestionSurveyList() {
  const { t } = useTranslation();

  return (
    <QuestionListWrapper className={'QuestionListWrapper'}>
      <div className="QuestionListWrapper__header">
        {t('common.surveyQuestionList')}:
      </div>
      <DisplayQuestionSurveyList />
    </QuestionListWrapper>
  );
}
