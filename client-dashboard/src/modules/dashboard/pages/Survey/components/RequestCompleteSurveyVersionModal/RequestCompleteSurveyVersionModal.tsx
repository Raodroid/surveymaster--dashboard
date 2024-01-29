import { FC, useCallback } from 'react';
import { Modal, notification, Spin } from 'antd';
import { FormikHelpers } from 'formik';
import {
  IModal,
  IUpdateSurveyVersionStatusDto,
  SurveyVersionStatus,
} from '@/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError } from '@/utils';
import RequestApproveFrom from '@components/RequestApproveForm/RequestApproveFrom';

const RequestCompleteSurveyVersionModal: FC<
  IModal & { surveyId?: string; versionId?: string }
> = props => {
  const { toggleOpen, open, versionId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const changeSurveyVersionStatusMutation = useMutation(
    (data: IUpdateSurveyVersionStatusDto) => {
      return SurveyService.updateStatusSurveyVersion({
        ...data,
        surveyVersionId: versionId as string,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.sentRequestSuccessfully') });
        toggleOpen();
      },
      onError,
    },
  );

  const onSubmit = useCallback(
    async (values: { userId: string }, helper: FormikHelpers<any>) => {
      await changeSurveyVersionStatusMutation.mutateAsync({
        status: SurveyVersionStatus.AWAIT_APPROVAL,
        approvalUserId: values.userId,
      });

      helper.resetForm();
    },
    [changeSurveyVersionStatusMutation],
  );

  return (
    <>
      <Modal
        centered
        title={t('common.requestApproveCompleteSurveyVersion')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin spinning={changeSurveyVersionStatusMutation.isLoading}>
          <RequestApproveFrom onSubmit={onSubmit} />
        </Spin>
      </Modal>
    </>
  );
};

export default RequestCompleteSurveyVersionModal;
