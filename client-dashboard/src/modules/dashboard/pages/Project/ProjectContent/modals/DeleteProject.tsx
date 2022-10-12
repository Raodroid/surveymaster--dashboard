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

export interface IDeleteProject extends IProjectModal {
  projectId: string;
}

function DeleteProject(props: IDeleteProject) {
  const { showModal, setShowModal, projectId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutationDeleteProject = useMutation(
    () =>
      ProjectService.deleteProject({
        projectId,
      }),
    {
      onSuccess: () => {
        notification.success({ message: t('common.deleteSuccess') });
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

  const handleDeleteProject = () => mutationDeleteProject.mutateAsync();

  return (
    <ConfirmProjectModal
      open={showModal}
      footer={false}
      title="Confirm Delete Project"
      onCancel={() => !mutationDeleteProject.isLoading && setShowModal(false)}
      width={MODAL_WIDTH.SMALL}
      centered
      destroyOnClose
      closeIcon={<CloseIcon />}
    >
      <Button
        type="primary"
        className="secondary-btn"
        onClick={handleDeleteProject}
        loading={mutationDeleteProject.isLoading}
      >
        OK
      </Button>
    </ConfirmProjectModal>
  );
}

export default DeleteProject;
