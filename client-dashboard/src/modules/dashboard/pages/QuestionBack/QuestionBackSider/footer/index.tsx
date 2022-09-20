import React, { useCallback } from 'react';
import { QuestionBankSiderFooterWrapper } from './style';
import { PlusIcon } from '../../../../../../icons';
import { useTranslation } from 'react-i18next';

const QuestionBankSiderFooter = () => {
  const { t } = useTranslation();
  const handleAddNewQuestion = useCallback(() => {}, []);
  return (
    <QuestionBankSiderFooterWrapper
      onClick={handleAddNewQuestion}
      className={'active-status'}
    >
      <PlusIcon />
      <span>{t('common.addNewQuestion')}</span>
    </QuestionBankSiderFooterWrapper>
  );
};

export default QuestionBankSiderFooter;
