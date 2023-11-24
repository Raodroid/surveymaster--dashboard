import React from 'react';
import { SaveIcon } from '@/icons';
import { Button } from 'antd';
import { useToggle } from '@/utils';
import { useTranslation } from 'react-i18next';
import ConfirmSubmitSurveyForm from './ConfirmSubmitSurveyForm';

const SurveyFormSubmitButton = () => {
  const [open, toggleOpen] = useToggle();
  const { t } = useTranslation();
  return (
    <>
      <Button type={'primary'} onClick={toggleOpen} icon={<SaveIcon />}>
        {t('common.completed')}
      </Button>
      <ConfirmSubmitSurveyForm open={open} toggleOpen={toggleOpen} />
    </>
  );
};

export default SurveyFormSubmitButton;
