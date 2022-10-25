import { Button, Modal, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { CloseIcon } from 'icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { ProjectService } from 'services';
import { onError } from 'utils';
import { IProjectModal } from '.';
import { ConfirmProjectModal } from './styles';

export interface IRestoreProject extends IProjectModal {
  projectId: string;
}

function RestoreProject(props: IRestoreProject) {
  const { showModal, setShowModal, projectId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutationRestoreProject = useMutation(
    () =>
      ProjectService.restoreProject({
        projectId,
      }),
    {
      onSuccess: () => {
        notification.success({ message: t('common.restoreSuccess') });
        queryClient.invalidateQueries('getProjects');
        queryClient.invalidateQueries('getAllProjects');
        setShowModal(false);
      },
      onError: (error: any) => {
        onError(error);
        setShowModal(false);
      },
    },
  );

  const handleRestoreProject = () => mutationRestoreProject.mutateAsync();

  return (
    <ConfirmProjectModal
      open={showModal}
      footer={false}
      title="Confirm Restore Project"
      onCancel={() => !mutationRestoreProject.isLoading && setShowModal(false)}
      width={MODAL_WIDTH.SMALL}
      centered
      destroyOnClose
      closeIcon={<CloseIcon />}
    >
      <Button
        type="primary"
        className="secondary-btn"
        onClick={handleRestoreProject}
        loading={mutationRestoreProject.isLoading}
      >
        OK
      </Button>
    </ConfirmProjectModal>
  );
}

export default RestoreProject;
