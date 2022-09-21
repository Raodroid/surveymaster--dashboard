import React, { useCallback } from 'react';
import { QuestionBankSiderFooterWrapper } from './style';
import { PlusIcon } from '../../../../../../icons';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../enums';

const QuestionBankSiderFooter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAddNewQuestion = useCallback(() => {
    navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ADD_QUESTION);
  }, [navigate]);

  const isActive = useMatch({
    path: '/app/question-bank/question',
    caseSensitive: false,
    end: false,
  });

  return (
    <QuestionBankSiderFooterWrapper
      onClick={handleAddNewQuestion}
      className={isActive ? 'active-status' : undefined}
    >
      <PlusIcon />
      <span>{t('common.addNewQuestion')}</span>
    </QuestionBankSiderFooterWrapper>
  );
};

export default QuestionBankSiderFooter;
