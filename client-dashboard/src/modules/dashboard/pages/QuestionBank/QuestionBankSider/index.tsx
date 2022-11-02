import React, { memo } from 'react';
import { QuestionBankSiderWrapper } from './style';
import QuestionBankSiderMainContent from './main-content';
import QuestionBankSiderFooter from './footer';
import { useCheckScopeEntity } from '../../../../common/hoc';
import { SCOPE_CONFIG } from '../../../../../enums/user';

const QuestionBankSider = () => {
  const { canCreate } = useCheckScopeEntity(SCOPE_CONFIG.ENTITY.QUESTIONS);
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
