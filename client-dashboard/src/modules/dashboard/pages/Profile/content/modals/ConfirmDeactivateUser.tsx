import { Button, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { CloseIcon } from 'icons';
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
      width={MODAL_WIDTH.SMALL}
      centered
      destroyOnClose
      closeIcon={<CloseIcon />}
    >
      <Button
        type="primary"
        className="secondary-btn"
        onClick={handleDeactivateUser}
        loading={mutationDeactivateUser.isLoading}
      >
        OK
      </Button>
    </ConfirmDeactivateModalStyled>
  );
}

export default ConfirmDeactivateUserModal;
