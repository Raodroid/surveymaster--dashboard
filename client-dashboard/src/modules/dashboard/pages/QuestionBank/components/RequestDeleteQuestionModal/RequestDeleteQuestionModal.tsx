import { FC, useCallback } from 'react';
import { Modal, notification, Spin } from 'antd';
import { FormikHelpers } from 'formik';
import { IModal, IRequestDeleteRecordDto } from '@/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from '@/services';
import { onError } from '@/utils';
import { RequestApproveFrom } from '@components/index';

const RequestDeleteQuestionModal: FC<
  IModal & { questionId: string }
> = props => {
  const { toggleOpen, open, questionId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: IRequestDeleteRecordDto) => {
      return QuestionBankService.requestDeleteQuestion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.sentRequestSuccessfully') });
        toggleOpen();
      },
      onError,
    },
  );

  const onSubmit = useCallback(
    async (
      values: { userId: string },
      helper: FormikHelpers<{ userId: string }>,
    ) => {
      await mutateAsync({
        isAwaitingDeletion: true,
        deletedBy: values.userId,
        id: questionId,
      });
      helper.resetForm();
    },
    [questionId, mutateAsync],
  );

  return (
    <>
      <Modal
        centered
        title={t('common.requestDeleteQuestion')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin spinning={isLoading}>
          <RequestApproveFrom onSubmit={onSubmit} />
        </Spin>
      </Modal>
    </>
  );
};

export default RequestDeleteQuestionModal;
