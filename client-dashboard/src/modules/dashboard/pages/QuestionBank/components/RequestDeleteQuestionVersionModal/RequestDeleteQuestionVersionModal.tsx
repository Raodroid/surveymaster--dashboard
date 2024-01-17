import { FC, useCallback } from 'react';
import { Modal, notification, Spin } from 'antd';
import { FormikHelpers } from 'formik';
import { IModal, IRequestDeleteRecordDto } from '@/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from '@/services';
import { onError } from '@/utils';
import RequestApproveFrom from '@components/RequestApproveForm/RequestApproveFrom';

const RequestDeleteQuestionVersionModal: FC<
  IModal & { versionId?: string }
> = props => {
  const { toggleOpen, open, versionId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const requestDeleteQuestionVersion = useMutation(
    (data: IRequestDeleteRecordDto) => {
      return QuestionBankService.requestDeleteQuestionVersion({
        ...data,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        await queryClient.invalidateQueries('getQuestionQuery');
        notification.success({ message: t('common.updateSuccess') });
        toggleOpen();
        // navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
      },
      onError,
    },
  );

  const onSubmit = useCallback(
    async (values: { userId: string }, helper: FormikHelpers<any>) => {
      if (!versionId) return;
      await requestDeleteQuestionVersion.mutateAsync({
        isAwaitingDeletion: true,
        deletedBy: values.userId,
        id: versionId,
      });
      helper.resetForm();
    },
    [requestDeleteQuestionVersion, versionId],
  );

  return (
    <>
      <Modal
        centered
        title={t('direction.requestApproveDelete')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin spinning={requestDeleteQuestionVersion.isLoading}>
          <RequestApproveFrom onSubmit={onSubmit} />
        </Spin>
      </Modal>
    </>
  );
};

export default RequestDeleteQuestionVersionModal;
