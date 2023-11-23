import React from 'react';
import { DuplicateChatIcon } from '@/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useToggle } from '@/utils';
import SurveyVersionRemarkModal from './SurveyVersionRemarkModal';

const SurveyVersionRemarkButton = () => {
  const [openForm, toggleForm] = useToggle();
  const { t } = useTranslation();
  return (
    <>
      <Button
        type={'text'}
        icon={<DuplicateChatIcon />}
        className={'px-1'}
        onClick={toggleForm}
      >
        <span className={'!text-[1rem] font-semibold'}>
          {t('common.remarks')}
        </span>
      </Button>
      <SurveyVersionRemarkModal open={openForm} toggleOpen={toggleForm} />
    </>
  );
};

export default SurveyVersionRemarkButton;
