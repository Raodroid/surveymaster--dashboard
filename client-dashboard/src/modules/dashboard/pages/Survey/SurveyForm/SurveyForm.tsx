import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Modal, notification } from 'antd';
import { ControlledInput } from '../../../../common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  CreateSurveyBodyDto,
  IPostSurveyVersionBodyDto,
  IPutSurveyVersionBodyDtoExtendId,
  ISurveyQuestionDto,
  ProjectTypes,
  SubSurveyFlowElementDto,
  SurveyVersionStatus,
} from '@/type';
import { onError, transformEnumToOption } from '@/utils';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService, UploadService } from '@/services';
import { ROUTE_PATH } from '@/enums';
import { useNavigate } from 'react-router-dom';
import { QuestionListWrapper, SurveyFormWrapper } from './style';
import { generatePath, useParams } from 'react-router';
import { TemplateOption } from './SurveyTemplateOption';
import { useGetProjectByIdQuery } from '@pages/Project/util';
import {
  SURVEY_EXTERNAL_FORM_SCHEMA,
  SURVEY_INTERNAL_FORM_SCHEMA,
} from '@/modules/common/validate/validate';
import SimpleBar from 'simplebar-react';
import { useToggle } from '@/utils';
import { transformSurveyVersion } from '@pages/Survey/components/SurveyPlayGround/util';
import {
  isSurveyFlowChange,
  transformInitSurveyFormData,
  useCheckSurveyFormMode,
} from '@pages/Survey/SurveyForm/util';
import { IAddSurveyFormValues, SurveyTemplateEnum } from './type';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';
import SurveyPlayGround from '@pages/Survey/components/SurveyPlayGround/SurveyPlayGround';
import HannahCustomSpin from '@components/HannahCustomSpin';

const { confirm } = Modal;

const SurveyForm: FC<{ isLoading?: boolean }> = props => {
  const { isLoading: isLoadingProps = false } = props;
  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const projectId = params.projectId || '';
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    isLoading: isFetchingSurveyData,
    currentSurveyVersion,
    surveyData,
  } = useGetSurveyById(params?.surveyId);
  const { project, isLoading: isFetchingProject } = useGetProjectByIdQuery(
    params?.projectId,
  );

  const initialValues = useMemo<IAddSurveyFormValues>(() => {
    return {
      ...transformInitSurveyFormData(currentSurveyVersion),
      projectId,
      surveyId: surveyData.displayId || '',
    };
  }, [currentSurveyVersion, projectId, surveyData?.displayId]);

  const { isViewMode, isEditMode } = useCheckSurveyFormMode();

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

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries('getProjects');
    await queryClient.invalidateQueries('getSurveyById');

    notification.success({
      message: t(`common.${isEditMode ? 'updateSuccess' : 'createSuccess'}`),
    });
  }, [isEditMode, queryClient, t]);

  const addSurveyMutation = useMutation(
    (data: CreateSurveyBodyDto) => {
      return SurveyService.createSurvey(data);
    },
    {
      onSuccess: async res => {
        const newVersion = res.data.versions[0];
        const fileType = 'application/octet-stream';

        if (excelUploadFile) {
          const file = excelUploadFile as Blob;
          const res = await SurveyService.getSignedUrl({
            filename: file['name'] as string,
            surveyVersionId: newVersion.id,
            fileType: fileType,
          });
          const { data } = res;
          await UploadService.putWithFormFileAsync(data.url, file, fileType);
          // await mutationUploadExcelFile.mutateAsync(newVersion.id);
        }
        await onSuccess();

        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: newVersion.surveyId,
          }) + `?version=${newVersion.displayId}`,
        );
      },
      onError,
    },
  );

  const addSurveyVersionMutation = useMutation(
    (data: IPostSurveyVersionBodyDto) => {
      return SurveyService.createSurveyVersion(data);
    },
    {
      onSuccess: async res => {
        await onSuccess();
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: res.data.surveyId,
          }) + `?version=${res.data.displayId}`,
        );
      },
      onError,
    },
  );

  const updateSurveyMutation = useMutation(
    (data: IPutSurveyVersionBodyDtoExtendId) => {
      return SurveyService.updateSurvey(data);
    },
    {
      onSuccess: async res => {
        await onSuccess();
        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: params.surveyId,
          }) + `?version=${res.data.displayId}`,
        );
      },
      onError,
    },
  );

  const duplicateSurveyMutation = useMutation(
    (data: CreateSurveyBodyDto & { surveyId: string }) => {
      return SurveyService.duplicateSurvey(data);
    },
    {
      onSuccess: async res => {
        const newVersion = res.data.versions[0];
        await onSuccess();

        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: newVersion.surveyId,
          }) + `?version=${newVersion.displayId}`,
        );
      },
      onError,
    },
  );

  const [loading, toggleLoading] = useToggle();

  const onSubmit = useCallback(
    async (values: IAddSurveyFormValues) => {
      const {
        version,
        selectedRowKeys,
        questionIdMap,
        template,
        surveyId,
        duplicateSurveyId,
        ...rest
      } = values;

      if (!values.projectId) {
        console.error('ProjectId is null');
        navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
        return;
      }
      try {
        toggleLoading();
        if (isExternalProject) {
          const transformSurveyFlowValues: SubSurveyFlowElementDto[] = (
            version?.surveyFlowElements || []
          ).map(flow => ({
            ...flow,
            surveyQuestions: (flow.surveyQuestions || []).reduce(
              (res: ISurveyQuestionDto[], q) => {
                if (
                  selectedRowKeys &&
                  !selectedRowKeys.some(key => key === q.questionVersionId)
                ) {
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
              },
              [],
            ),
          }));

          // if (isEditMode) {
          //   if (
          //     currentSurveyVersion?.status === SurveyVersionStatus.COMPLETED &&
          //     isSurveyFlowChange(
          //       questions,
          //       initialValues.version.questions,
          //     )
          //   ) {
          //     confirm({
          //       icon: null,
          //       content: t('common.confirmCreateNewExternalSurveyVersion'),
          //       onOk() {
          //         addSurveyVersionMutation.mutateAsync({
          //           surveyId: params.surveyId as string,
          //           ...transformSurveyFlowValues.version,
          //           status: SurveyVersionStatus.DRAFT,
          //         });
          //         return;
          //       },
          //       onCancel() {
          //         return;
          //       },
          //     });
          //
          //     return;
          //   }
          //
          //   await updateSurveyMutation.mutateAsync({
          //     ...transformSurveyFlowValues.version,
          //     surveyVersionId: currentSurveyVersion?.id as string,
          //     name: transformSurveyFlowValues.version?.name || '',
          //     questions: transformSurveyFlowValues.version?.questions || [],
          //     status: transformSurveyFlowValues.version?.status || SurveyVersionStatus.DRAFT,
          //     remark: transformSurveyFlowValues.version.remark || null,
          //   });
          //   return;
          // }
          await addSurveyMutation.mutateAsync({
            projectId,
            version: {
              name: values.version?.name,
              remark: values.version?.remark,
              surveyFlowElements: transformSurveyFlowValues,
              status: SurveyVersionStatus.COMPLETED,
            },
          });
          return;
        }

        if (isEditMode) {
          if (
            currentSurveyVersion?.status === SurveyVersionStatus.COMPLETED &&
            isSurveyFlowChange(
              version?.surveyFlowElements,
              initialValues.version?.surveyFlowElements,
            )
          ) {
            const transformValue: CreateSurveyBodyDto = {
              version: transformSurveyVersion(values),
              projectId: values.projectId,
            };
            confirm({
              icon: null,
              content: t('common.confirmCreateNewSurveyVersion'),
              onOk() {
                addSurveyVersionMutation.mutateAsync({
                  surveyId: params.surveyId as string,
                  ...transformValue.version,
                });
              },
            });
            return;
          }
        }

        const transformValue: CreateSurveyBodyDto = {
          version: transformSurveyVersion(values),
          projectId: values.projectId,
        };

        if (isEditMode) {
          await updateSurveyMutation.mutateAsync({
            ...transformValue.version,
            surveyVersionId: currentSurveyVersion?.id as string,
            name: transformValue.version?.name || '',
            status: transformValue.version?.status || SurveyVersionStatus.DRAFT,
            remark: transformValue.version?.remark || null,
          });
          return;
        }

        if (values.template === SurveyTemplateEnum.DUPLICATE) {
          await duplicateSurveyMutation.mutateAsync({
            version: {
              name: transformValue.version?.name,
              remark: transformValue.version?.remark,
            },
            projectId: params.projectId as string,
            surveyId: duplicateSurveyId as string,
          });
          return;
        }

        if (values.template === SurveyTemplateEnum.NEW) {
          await addSurveyMutation.mutateAsync(transformValue);
          return;
        }
      } finally {
        toggleLoading();
      }
    },
    [
      navigate,
      toggleLoading,
      isExternalProject,
      isEditMode,
      addSurveyMutation,
      projectId,
      currentSurveyVersion?.status,
      currentSurveyVersion?.id,
      initialValues.version?.surveyFlowElements,
      updateSurveyMutation,
      t,
      addSurveyVersionMutation,
      params.surveyId,
      params.projectId,
      duplicateSurveyMutation,
    ],
  );

  const actionLoading =
    mutationUploadExcelFile.isLoading ||
    duplicateSurveyMutation.isLoading ||
    addSurveyMutation.isLoading ||
    updateSurveyMutation.isLoading ||
    addSurveyVersionMutation.isLoading;

  const isLoading =
    isFetchingProject || isFetchingSurveyData || isLoadingProps || loading;

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
        {({ values, isValid, dirty, handleSubmit }) => (
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
                  {!isExternalProject && !isEditMode && !isViewMode && (
                    <ControlledInput
                      className={className}
                      inputType={INPUT_TYPES.SELECT}
                      name={'template'}
                      options={transformEnumToOption(SurveyTemplateEnum, type =>
                        t(`surveyTemplateEnum.${type}`),
                      )}
                      dropdownRender={TemplateOption}
                      label={t('common.surveyType')}
                    />
                  )}
                  <ControlledInput
                    inputType={
                      isEditMode
                        ? INPUT_TYPES.INPUT_DEBOUNCE
                        : INPUT_TYPES.INPUT
                    }
                    name="version.name"
                    className={className}
                    label={
                      isExternalProject
                        ? t('common.externalSurveyTitle')
                        : t('common.surveyTitle')
                    }
                  />
                  <ControlledInput
                    inputType={
                      isEditMode
                        ? INPUT_TYPES.INPUT_DEBOUNCE
                        : INPUT_TYPES.TEXTAREA
                    }
                    name="version.remark"
                    label={t('common.surveyRemarks')}
                    className={className}
                  />
                </div>
                {isEditMode && (
                  <>
                    <div className="divider" />
                    <div
                      className={
                        'SurveyFormWrapper__survey-info__params-section'
                      }
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
                  </>
                )}{' '}
              </div>

              <div className={'SurveyFormWrapper__question mb-[2.5rem]'}>
                {isExternalProject ? (
                  <QuestionSurveyList
                    isExternalProject={true}
                    setExcelUploadFile={setExcelUploadFile}
                  />
                ) : (
                  <SurveyPlayGround />
                )}
                {/*{(isExternalProject ||*/}
                {/*  values?.template === SurveyTemplateEnum.NEW) && (*/}
                {/*  <QuestionSurveyList*/}
                {/*    isExternalProject={true}*/}
                {/*    setExcelUploadFile={setExcelUploadFile}*/}
                {/*  />*/}
                {/*)}*/}
              </div>
              <div className={'SurveyFormWrapper__submit_btn'}>
                {!isViewMode && (
                  <Button
                    type="primary"
                    className="info-btn"
                    htmlType="submit"
                    loading={actionLoading}
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

  const { isViewMode, isEditMode } = useCheckSurveyFormMode();

  return (
    <SimpleBar style={{ height: '100%' }}>
      <QuestionListWrapper className={'QuestionListWrapper'}>
        <div className="QuestionListWrapper__header">
          {isExternalProject &&
          !currentSurveyVersion?.surveyFlowElements?.length
            ? t('common.uploadFile')
            : t('common.surveyQuestionList')}
        </div>

        {/*{!isViewMode && (*/}
        {/*  <UploadExternalFile setExcelUploadFile={setExcelUploadFile} />*/}
        {/*)}*/}

        {/*{isViewMode && (*/}
        {/*  <ViewSurveyQuestionList questions={currentSurveyVersion?.questions} />*/}
        {/*)}*/}
      </QuestionListWrapper>
    </SimpleBar>
  );
};
