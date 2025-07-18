import { useCallback } from 'react';
import { QuestionBankSiderFooterWrapper } from './style';
import { PlusIcon } from '@/icons';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';
import templateVariable from '@/app/template-variables.module.scss';

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
      <PlusIcon
        style={{ color: templateVariable.primary_color, marginRight: 14 }}
      />
      <span>{t('common.addNewQuestion')}</span>
    </QuestionBankSiderFooterWrapper>
  );
};

export default QuestionBankSiderFooter;
