import React, { memo } from 'react';
import { QuestionBankSiderWrapper } from './style';
import QuestionBankSiderMainContent from './main-content';
import QuestionBankSiderFooter from './footer';
import { useCheckScopeEntityDefault } from '../../../../common/hoc';
import { SCOPE_CONFIG } from 'enums';

const QuestionBankSider = () => {
  const { canCreate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTION,
  );
  return (
    <QuestionBankSiderWrapper>
      <div className={'question-bank__body'}>
        <QuestionBankSiderMainContent />
      </div>
      {canCreate && (
        <div className={'question-bank__footer '}>
          <QuestionBankSiderFooter />
        </div>
      )}
    </QuestionBankSiderWrapper>
  );
};

export default memo(QuestionBankSider);
