import { Button, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { CloseIcon } from 'icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AdminService } from 'services';
import { onError } from 'utils';
import { ProfileModal } from '.';
import { ConfirmDeactivateModalStyled } from './styles';

function ConfirmRestoreUserModal(props: ProfileModal) {
  const { showModal, setShowModal, userId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutationRestoreUser = useMutation(
    () => {
      return AdminService.restoreUser({
        userId,
      });
    },
    {
      onSuccess: () => {
        notification.success({ message: t('common.restoreSuccess') });
        queryClient.invalidateQueries('getTeamMembers');
        setShowModal(false);
      },
      onError: (error: any) => {
        onError(error);
        setShowModal(false);
      },
    },
  );

  const handleRestoreUser = () => mutationRestoreUser.mutateAsync();

  return (
    <ConfirmDeactivateModalStyled
      open={showModal}
      footer={false}
      title="Confirm Restore User"
      onCancel={() => setShowModal(false)}
      width={MODAL_WIDTH.SMALL}
      centered
      destroyOnClose
      closeIcon={<CloseIcon />}
    >
      <Button
        type="primary"
        className="secondary-btn"
        onClick={handleRestoreUser}
        loading={mutationRestoreUser.isLoading}
      >
        OK
      </Button>
    </ConfirmDeactivateModalStyled>
  );
}

export default ConfirmRestoreUserModal;
