import { Button, notification } from 'antd';
import { CloseIcon } from 'icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AdminService } from 'services';
import { onError } from 'utils';
import { ProfileModal } from '.';
import { ConfirmDeactivateModalStyled } from './styles';

interface ConfirmDeactivate extends ProfileModal {
  userId: string;
}

function ConfirmDeactivateUserModal(props: ConfirmDeactivate) {
  const { showModal, setShowModal, userId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutationDeactivateUser = useMutation(
    () => {
      return AdminService.deactivateUser({
        userId,
      });
    },
    {
      onSuccess: () => {
        notification.success({ message: t('common.updateSuccess') });
        queryClient.invalidateQueries('getTeamMembers');
        setShowModal(false);
      },
      onError: (error: any) => {
        onError(error);
        setShowModal(false);
      },
    },
  );

  const handleDeactivateUser = () => mutationDeactivateUser.mutateAsync();

  return (
    <ConfirmDeactivateModalStyled
      open={showModal}
      footer={false}
      title="Confirm deactivate user"
      onCancel={() => setShowModal(false)}
      width={360}
      centered
      destroyOnClose
      closeIcon={<CloseIcon />}
    >
      <Button onClick={handleDeactivateUser}>OK</Button>
    </ConfirmDeactivateModalStyled>
  );
}

export default ConfirmDeactivateUserModal;
