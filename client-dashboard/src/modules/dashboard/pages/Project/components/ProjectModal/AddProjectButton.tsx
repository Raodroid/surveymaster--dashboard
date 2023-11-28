import React from 'react';
import { useToggle } from '@/utils';
import { Button } from 'antd';
import { PlusIcon } from '@/icons';
import ProjectModal from './ProjectModal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

const AddProjectButton = () => {
  const [openModal, toggleModal] = useToggle();
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string }>();
  return (
    <>
      <Button
        size={'large'}
        type={'text'}
        icon={<PlusIcon />}
        onClick={toggleModal}
        className={'font-semibold'}
      >
        {t('common.addProject')}
      </Button>
      <ProjectModal
        open={openModal}
        toggleOpen={toggleModal}
        mode={'create'}
        projectId={params?.projectId}
      />
    </>
  );
};

export default AddProjectButton;
