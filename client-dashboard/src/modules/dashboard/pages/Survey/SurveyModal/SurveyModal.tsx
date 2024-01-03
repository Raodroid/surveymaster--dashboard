import { FC, useCallback, useMemo } from 'react';
import {
  CreateSurveyBodyDto,
  DuplicateSurveyVersionDto,
  IModal,
  ISurveyVersionBaseDto,
  SurveyVersionStatus,
} from '@/type';
import { Button, Form, Modal, notification, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { ControlledInput, SURVEY_INTERNAL_FORM_SCHEMA } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { Formik } from 'formik';
import { TemplateOption } from '@pages/Survey/SurveyForm/SurveyTemplateOption';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { generatePath, useNavigate, useParams } from 'react-router';
import { ROUTE_PATH } from '@/enums';
import { onError } from '@/utils';
import { SurveyTemplateEnum, useSurveyFormContext } from '@pages/Survey';

interface IForm {
  projectId: string;
  version?: Omit<ISurveyVersionBaseDto, 'remarks'> & {
    remark: string;
  };
  template?: SurveyTemplateEnum | string;
  duplicateSurveyId?: string;
}

const defaultInitValue: IForm = {
  projectId: '',
  template: '',
  duplicateSurveyId: '',

  version: {
    name: '',
    remark: '',
    status: SurveyVersionStatus.DRAFT,
  },
};
const SurveyModal: FC<IModal & { mode: 'create' | 'view' }> = props => {
  const { open, toggleOpen, mode } = props;
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { survey } = useSurveyFormContext();

  const initValue = useMemo<IForm & { displayId?: string }>(() => {
    if (mode === 'create') return defaultInitValue;
    return {
      ...defaultInitValue,
      version: {
        remark: '',
        name: survey.currentSurveyVersion?.name,
        status: survey.currentSurveyVersion?.status,
      },
      displayId: survey.currentSurveyVersion?.displayId,
    };
  }, [mode, survey.currentSurveyVersion]);

  const onSuccess = useCallback(async () => {
    await queryClient.invalidateQueries('getProjects');
    await queryClient.invalidateQueries('getSurveyById');

    notification.success({
      message: t('common.createSuccess'),
    });
  }, [queryClient, t]);

  const duplicateSurveyMutation = useMutation(
    (data: DuplicateSurveyVersionDto & { surveyId: string }) => {
      return SurveyService.duplicateSurvey(data);
    },
    {
      onSuccess: async res => {
        const newVersion = res.data.versions[0];
        await onSuccess();

        navigate(
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT, {
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
        // const fileType = 'application/octet-stream';

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
          generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT, {
            projectId: params.projectId,
            surveyId: newVersion.surveyId,
          }) +
            `?version=${newVersion.displayId}&surveyVersionId=${newVersion.id}`,
        );
      },
      onError,
    },
  );

  const onFinish = useCallback(
    async (values: IForm) => {
      if (!params.projectId) return;

      const data: DuplicateSurveyVersionDto['version'] = {
        name: values.version?.name as string,
        remarks: [values.version?.remark] as string[],
      };

      if (values.template === SurveyTemplateEnum.DUPLICATE) {
        await duplicateSurveyMutation.mutateAsync({
          version: data,
          surveyId: values.duplicateSurveyId as string,
        });
        return;
      }
      await addSurveyMutation.mutateAsync({
        version: data,
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
      title={
        mode === 'create' ? t('common.addNewSurvey') : t('common.surveyInfo')
      }
    >
      <Spin spinning={addSurveyMutation.isLoading}>
        <Formik
          enableReinitialize
          onSubmit={onFinish}
          initialValues={initValue}
          validationSchema={SURVEY_INTERNAL_FORM_SCHEMA}
        >
          {({ handleSubmit }) => (
            <>
              <Form layout={'vertical'} onFinish={handleSubmit}>
                {mode === 'create' && <TemplateOption />}
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name="version.name"
                  label={t('common.title')}
                  className={mode === 'view' ? 'view-mode' : undefined}
                />
                {mode === 'view' && (
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    name="displayId"
                    label={t(`common.displayId`)}
                    className={'view-mode'}
                  />
                )}
                {mode === 'create' && (
                  <ControlledInput
                    inputType={INPUT_TYPES.TEXTAREA}
                    name="version.remark"
                    label={t('common.remark')}
                  />
                )}
                {mode === 'create' && (
                  <Button
                    size={'large'}
                    type={'primary'}
                    className="secondary-btn w-full"
                    htmlType="submit"
                  >
                    {t('common.createSurvey')}
                  </Button>
                )}
              </Form>
            </>
          )}
        </Formik>
      </Spin>
    </Modal>
  );
};

export default SurveyModal;
