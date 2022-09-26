import React from 'react';
import { EditQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useTranslation } from 'react-i18next';

const EditQuestion = () => {
  const { t } = useTranslation();
  return (
    <EditQuestionWrapper>
      <GeneralSectionHeader title={t('common.editQuestion')} />
    </EditQuestionWrapper>
  );
};

export default EditQuestion;
