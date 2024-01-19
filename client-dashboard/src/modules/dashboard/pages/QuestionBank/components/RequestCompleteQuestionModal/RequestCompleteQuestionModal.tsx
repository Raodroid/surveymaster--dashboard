import { FC, useCallback } from 'react';
import { Modal, notification, Spin } from 'antd';
import { FormikHelpers } from 'formik';
import { IModal, QuestionVersionStatus } from '@/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from '@/services';
import { onError } from '@/utils';
import { ROUTE_PATH } from '@/enums';
import { useNavigate } from 'react-router-dom';
import RequestApproveFrom from '@components/RequestApproveForm/RequestApproveFrom';

const RequestCompleteQuestionModal: FC<
  IModal & { versionId?: string }
> = props => {
  const { toggleOpen, open, versionId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateQuestionVersionStatus = useMutation(
    (data: {
      status: QuestionVersionStatus;
      approvalUserId: string;
      id: string;
    }) => {
      return QuestionBankService.changeStatusQuestionVersion({
        ...data,
        // version: { status },
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        await queryClient.invalidateQueries('getQuestionQuery');
        notification.success({ message: t('common.sentRequestSuccessfully') });
        navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
      },
      onError,
    },
  );

  const onSubmit = useCallback(
    async (values: { userId: string }, helper: FormikHelpers<any>) => {
      if (!versionId) return;
      await updateQuestionVersionStatus.mutateAsync({
        status: QuestionVersionStatus.AWAIT_APPROVAL,
        approvalUserId: values.userId,
        id: versionId,
      });
      helper.resetForm();
    },
    [updateQuestionVersionStatus, versionId],
  );

  return (
    <>
      <Modal
        centered
        title={t('common.requestApproveCompleteQuestion')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin spinning={updateQuestionVersionStatus.isLoading}>
          <RequestApproveFrom onSubmit={onSubmit} />
        </Spin>
      </Modal>
    </>
  );
};

export default RequestCompleteQuestionModal;
