import React from 'react';
import { useToggle } from '@/utils';
import { Button, Tooltip } from 'antd';
import { DetailIcon } from '@/icons';
import ProjectModal from './ProjectModal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

const ViewProjectDetailButton = () => {
  const [openModal, toggleModal] = useToggle();
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string }>();
  return (
    <>
      <Tooltip placement={'bottomLeft'} title={t('common.projectInfo')}>
        <Button
          size={'large'}
          type={'text'}
          icon={<DetailIcon />}
          onClick={toggleModal}
          className={'font-semibold'}
        />
      </Tooltip>
      <ProjectModal
        open={openModal}
        toggleOpen={toggleModal}
        mode={'view'}
        projectId={params?.projectId}
      />
    </>
  );
};

export default ViewProjectDetailButton;
