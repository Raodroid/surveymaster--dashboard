import React, { FC, useCallback } from 'react';
import { CreateSurveyBodyDto, IModal, SurveyVersionStatus } from '@/type';
import { Button, Form, Modal, notification, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ControlledInput,
  FormWrapper,
  SURVEY_INTERNAL_FORM_SCHEMA,
} from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { Formik } from 'formik';
import { TemplateOption } from '@pages/Survey/SurveyForm/SurveyTemplateOption';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { generatePath, useNavigate, useParams } from 'react-router';
import { ROUTE_PATH } from '@/enums';
import { onError } from '@/utils';
import { SurveyTemplateEnum } from '@pages/Survey';

const initValue: CreateSurveyBodyDto = {
  projectId: '',
  template: '',
  duplicateSurveyId: '',

  version: {
    name: '',
    remark: '',
    status: SurveyVersionStatus.DRAFT,
  },
};
const SurveyModal: FC<IModal> = props => {
  const { open, toggleOpen } = props;
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries('getProjects');
    await queryClient.invalidateQueries('getSurveyById');

    notification.success({
      message: t('common.createSuccess'),
    });
  }, [queryClient, t]);

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
  const addSurveyMutation = useMutation(
    (data: CreateSurveyBodyDto) => {
      return SurveyService.createSurvey({
        ...data,
      });
    },
    {
      onSuccess: async res => {
        const newVersion = res.data.versions[0];
        const fileType = 'application/octet-stream';

        // if (excelUploadFile) {
        //   const file = excelUploadFile as Blob;
        //   const res = await SurveyService.getSignedUrl({
        //     filename: file['name'] as string,
        //     surveyVersionId: newVersion.id,
        //     fileType: fileType,
        //   });
        //   const { data } = res;
        //   await UploadService.putWithFormFileAsync(data.url, file, fileType);
        //   // await mutationUploadExcelFile.mutateAsync(newVersion.id);
        // }
        // await onSuccess();

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

  const onFinish = useCallback(
    async (values: CreateSurveyBodyDto) => {
      if (!params.projectId) return;
      if (values.template === SurveyTemplateEnum.DUPLICATE) {
        await duplicateSurveyMutation.mutateAsync({
          version: {
            name: values.version?.name,
            remark: values.version?.remark,
          },
          template: values.template,
          projectId: params.projectId as string,
          surveyId: values.duplicateSurveyId as string,
        });
        return;
      }
      await addSurveyMutation.mutateAsync({
        ...values,
        projectId: params.projectId,
      });
    },
    [addSurveyMutation, duplicateSurveyMutation, params.projectId],
  );

  return (
    <Modal
      open={open}
      onCancel={toggleOpen}
      width={488}
      footer={false}
      centered
      title={t('common.addNewSurvey')}
    >
      <Spin spinning={addSurveyMutation.isLoading}>
        <Formik
          onSubmit={onFinish}
          initialValues={initValue}
          validationSchema={SURVEY_INTERNAL_FORM_SCHEMA}
        >
          {({ handleSubmit }) => (
            <FormWrapper>
              <Form
                layout={'vertical'}
                onFinish={handleSubmit}
                className={'sign-in-form'}
              >
                <TemplateOption />
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name="version.name"
                  label={t('common.title')}
                />

                <ControlledInput
                  inputType={INPUT_TYPES.TEXTAREA}
                  name="version.remark"
                  label={t(`common.remark`)}
                />
                <Button
                  type={'primary'}
                  className="secondary-btn w-full"
                  htmlType="submit"
                >
                  {t('common.createSurvey')}
                </Button>
              </Form>
            </FormWrapper>
          )}
        </Formik>
      </Spin>
    </Modal>
  );
};

export default SurveyModal;
