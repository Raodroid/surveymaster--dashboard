import { FC, useCallback } from 'react';
import { Modal, notification, Spin } from 'antd';
import { FormikHelpers } from 'formik';
import { IModal, IRequestDeleteRecordDto } from '@/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError } from '@/utils';
import RequestApproveForm from '@components/RequestApproveForm/RequestApproveForm';

const RequestDeleteSurveyVersionModal: FC<
  IModal & { versionId?: string }
> = props => {
  const { toggleOpen, open, versionId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: IRequestDeleteRecordDto) => {
      return SurveyService.requestDeleteSurveyVersion({
        ...data,
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
      if (!versionId) return;
      await mutateAsync({
        isAwaitingDeletion: true,
        deletedBy: values.userId,
        id: versionId,
      });

      helper.resetForm();
    },
    [mutateAsync, versionId],
  );

  return (
    <>
      <Modal
        centered
        title={t('common.requestDeleteSurveyVersion')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin spinning={isLoading}>
          <RequestApproveForm onSubmit={onSubmit} />
        </Spin>
      </Modal>
    </>
  );
};

export default RequestDeleteSurveyVersionModal;
