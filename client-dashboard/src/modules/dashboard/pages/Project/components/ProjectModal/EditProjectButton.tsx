import React from 'react';
import { useToggle } from '@/utils';
import { Button } from 'antd';
import { PenFilled } from '@/icons';
import ProjectModal from './ProjectModal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

const EditProjectButton = () => {
  const [openModal, toggleModal] = useToggle();
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string }>();

  return (
    <>
      <Button
        size={'large'}
        type={'text'}
        icon={<PenFilled />}
        onClick={toggleModal}
        className={'font-semibold'}
      >
        {t('common.editProject')}
      </Button>
      <ProjectModal
        open={openModal}
        toggleOpen={toggleModal}
        mode={'edit'}
        projectId={params.projectId}
      />
    </>
  );
};

export default EditProjectButton;
