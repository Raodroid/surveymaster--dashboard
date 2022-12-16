import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Button, notification } from 'antd';
import { ControlledInput } from '../../../../../../../common';
import { INPUT_TYPES } from '../../../../../../../common/input/type';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  IPostSurveyBodyDto,
  IQuestionVersion,
  ISurveyQuestionDto,
  ISurveyVersion,
  ProjectTypes,
  QuestionType,
} from 'type';
import { onError, transformEnumToOption } from 'utils';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from 'services';
import { ROUTE_PATH } from 'enums';
import { useMatch, useNavigate } from 'react-router-dom';
import { QuestionListWrapper, SurveyFormWrapper } from './style';
import { generatePath, useParams } from 'react-router';
import { TemplateOption } from './SurveyTemplateOption';
import { useGetSurveyById } from '../../Survey/util';
import HannahCustomSpin from '../../../../../../components/HannahCustomSpin';
import { useGetProjectByIdQuery } from '../../../../util';
import UploadExternalFile from './EditSurveyQuestionList/UploadExternalFile';
import {
  SURVEY_EXTERNAL_FORM_SCHEMA,
  SURVEY_INTERNAL_FORM_SCHEMA,
} from '../../../../../../../common/validate/validate';
import ViewSurveyQuestionList from './ViewSurveyQuestionList';
import SimpleBar from 'simplebar-react';

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
  createdAt?: string | Date | null;
};

export interface IAddSurveyFormValues extends IPostSurveyBodyDto {
  createdAt?: string | Date | null;
  template: SurveyTemplateEnum | string;
  questions: questionValueType[];
  questionIdMap?: Record<
    string,
    {
      questionTitle: string;
      versions: IQuestionVersion[];
      createdAt: string | Date | null;
    } // object of { [questionVersionId] : {questionTitle: string, versions: version.id[]}}
  >;
  selectedRowKeys?: string[];
}

const transformQuestionData = (
  input?: ISurveyVersion,
): questionValueType[] | undefined => {
  if (!input || !input?.questions) return undefined;

  const { questions } = input;

  return (
    questions
      ?.sort((q1, q2) => q1.sort - q2.sort)
      ?.map(q => ({
        questionTitle: q.questionVersion?.title as string,
        type: q.questionVersion?.type as string,
        remark: q.remark as string,
        questionVersionId: q.questionVersionId,
        id: q.questionVersion?.questionId,
        versions: q.questionVersion?.question?.versions,
        category: q.questionVersion?.question?.masterCategory?.name as string,
        parameter: q.parameter,
      })) || []
  );
};

const createQuestionMap = (
  input?: ISurveyVersion,
):
  | Record<
      string,
      {
        questionTitle: string;
        versions: IQuestionVersion[];
        createdAt: string | Date | null;
      } // object of { [questionVersionId] : {questionTitle: string, versions: version.id[]}}
    >
  | undefined => {
  if (!input || !input?.questions) return undefined;

  const { questions } = input;

  return questions?.reduce((res, q) => {
    if (!q.questionVersion?.question?.versions) {
      return res;
    }

    return {
      ...res,
      [q.questionVersionId]: {
        createdAt: q.questionVersion.createdAt,
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

  const { isLoading: isFetchingSurveyData, currentSurveyVersion } =
    useGetSurveyById(params?.surveyId);
  const { project, isLoading: isFetchingProject } = useGetProjectByIdQuery(
    params?.projectId,
  );

  const isLoading = isFetchingProject || isFetchingSurveyData;

  const initialValues = useMemo<IAddSurveyFormValues>(
    () => ({
      createdAt: currentSurveyVersion?.survey?.createdAt,
      surveyId: currentSurveyVersion?.survey?.id || '',
      name: currentSurveyVersion?.name || '',
      template: SurveyTemplateEnum.NEW,
      remark: currentSurveyVersion?.remark || '',
      questions: transformQuestionData(currentSurveyVersion) || [],
      questionIdMap: createQuestionMap(currentSurveyVersion),
      projectId,
      selectedRowKeys: currentSurveyVersion?.questions?.map(
        q => q.questionVersion?.questionId as string,
      ),
    }),
    [currentSurveyVersion, projectId],
  );
  const editSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
    end: true,
    caseSensitive: true,
  });
  const createSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY,
    end: true,
    caseSensitive: true,
  });

  const isEditMode = !!editSurveyRouteMath;
  const isCreateMode = !!createSurveyRouteMath;

  const isViewMode = !(isEditMode || isCreateMode);

  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const [excelUploadFile, setExcelUploadFile] = useState<string | Blob>('');

  const mutationUploadExcelFile = useMutation(
    (id: string) =>
      SurveyService.uploadExcelFile({
        id,
        file: excelUploadFile,
      }),
    {
      onError,
    },
  );

  const onSuccess = useCallback(
    async res => {
      await queryClient.invalidateQueries('getProjects');
      await queryClient.invalidateQueries('getSurveyById');

      if (excelUploadFile)
        await mutationUploadExcelFile.mutateAsync(res.data.id);

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
    [
      excelUploadFile,
      isEditMode,
      mutationUploadExcelFile,
      navigate,
      params.projectId,
      queryClient,
      t,
    ],
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
      const { questions, selectedRowKeys, questionIdMap, template, ...rest } =
        values;

      if (!values.projectId) {
        console.error('ProjectId is null');
        navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
        return;
      }

      if (isExternalProject) {
        const newValues = {
          ...rest,
          questions: questions.reduce((res: ISurveyQuestionDto[], q) => {
            if (selectedRowKeys && !selectedRowKeys.some(key => key === q.id)) {
              return res;
            }
            return [
              ...res,
              {
                sort: res.length + 1,
                remark: q.remark,
                questionVersionId: q.questionVersionId,
                parameter: q.parameter,
              },
            ];
          }, []),
        };

        if (isEditMode) {
          await updateSurveyMutation.mutateAsync(newValues);
          return;
        }
        await addSurveyMutation.mutateAsync(newValues);
        return;
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
        return;
      }

      if (values.template === SurveyTemplateEnum.DUPLICATE) {
        await duplicateSurveyMutation.mutateAsync(transformValue);
        return;
      }

      if (values.template === SurveyTemplateEnum.NEW) {
        transformValue.questions = questions.map((q, index) => ({
          questionVersionId: q.questionVersionId,
          sort: index + 1,
          remark: q.remark,
        }));
        await addSurveyMutation.mutateAsync(transformValue);
        return;
      }
    },
    [
      addSurveyMutation,
      duplicateSurveyMutation,
      isEditMode,
      isExternalProject,
      navigate,
      updateSurveyMutation,
    ],
  );

  const wrapperRef = useRef<any>();

  const className = isViewMode ? 'view-mode' : '';

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={
          isExternalProject
            ? SURVEY_EXTERNAL_FORM_SCHEMA
            : SURVEY_INTERNAL_FORM_SCHEMA
        }
        enableReinitialize={true}
      >
        {({ values, isValid, handleSubmit }) => (
          <SurveyFormWrapper
            layout="vertical"
            onFinish={handleSubmit as any}
            ref={wrapperRef}
          >
            <HannahCustomSpin parentRef={wrapperRef} spinning={isLoading} />
            <>
              <div className={'SurveyFormWrapper__survey-info'}>
                <div
                  className={
                    'SurveyFormWrapper__survey-info__survey-detail-section'
                  }
                >
                  <div className="title mainInfo">
                    {isExternalProject && t('common.external')}{' '}
                    {t('common.mainInformation')}:
                  </div>
                  {!isExternalProject && !isEditMode && (
                    <ControlledInput
                      className={className}
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
                    className={className}
                    label={
                      isExternalProject
                        ? t('common.externalSurveyTitle')
                        : t('common.surveyTitle')
                    }
                  />
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    name="remark"
                    label={t('common.surveyRemarks')}
                    className={className}
                  />
                </div>
                <div className="divider" />
                <div
                  className={'SurveyFormWrapper__survey-info__params-section'}
                >
                  <div className="title params">
                    {isExternalProject && t('common.external')}{' '}
                    {t('common.surveyParameters')}:
                  </div>

                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    name="surveyId"
                    label="ID"
                    className={'view-mode'}
                  />
                </div>
              </div>

              <div className={'SurveyFormWrapper__question'}>
                {(isExternalProject ||
                  values?.template === SurveyTemplateEnum.NEW) && (
                  <QuestionSurveyList
                    isExternalProject={isExternalProject}
                    setExcelUploadFile={setExcelUploadFile}
                  />
                )}
              </div>
              <div className={'SurveyFormWrapper__submit_btn'}>
                {!isViewMode && (
                  <Button
                    type="primary"
                    className="info-btn"
                    htmlType="submit"
                    disabled={!isValid}
                    loading={
                      addSurveyMutation.isLoading ||
                      updateSurveyMutation.isLoading
                    }
                  >
                    {t('common.saveSurvey')}
                  </Button>
                )}
              </div>
            </>
          </SurveyFormWrapper>
        )}
      </Formik>
    </>
  );
};

export default SurveyForm;

const QuestionSurveyList: FC<{
  isExternalProject: boolean;
  setExcelUploadFile: (value: string | Blob) => void;
}> = props => {
  const { isExternalProject, setExcelUploadFile } = props;
  const { t } = useTranslation();
  const params = useParams<{ surveyId?: string }>();
  const { currentSurveyVersion } = useGetSurveyById(params?.surveyId);

  const editSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
    end: true,
    caseSensitive: true,
  });

  const createSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY,
    end: true,
    caseSensitive: true,
  });

  const isEditMode = !!editSurveyRouteMath;
  const isCreateMode = !!createSurveyRouteMath;

  const isViewMode = !(isEditMode || isCreateMode);

  return (
    <SimpleBar style={{ height: '100%' }}>
      <QuestionListWrapper className={'QuestionListWrapper'}>
        <div className="QuestionListWrapper__header">
          {isExternalProject && !currentSurveyVersion?.questions?.length
            ? t('common.uploadFile')
            : t('common.surveyQuestionList')}
        </div>

        {!isViewMode && (
          <UploadExternalFile setExcelUploadFile={setExcelUploadFile} />
        )}

        {isViewMode && (
          <ViewSurveyQuestionList questions={currentSurveyVersion?.questions} />
        )}
      </QuestionListWrapper>
    </SimpleBar>
  );
};
