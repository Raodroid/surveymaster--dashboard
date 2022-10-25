import React, { memo } from 'react';
import { QuestionBankSiderWrapper } from './style';
import QuestionBankSiderMainContent from './main-content';
import QuestionBankSiderFooter from './footer';

const QuestionBankSider = () => {
  return (
    <QuestionBankSiderWrapper>
      <div className={'question-bank__body'}>
        <QuestionBankSiderMainContent />
      </div>
      <div className={'question-bank__footer '}>
        <QuestionBankSiderFooter />
      </div>
    </QuestionBankSiderWrapper>
  );
};

export default memo(QuestionBankSider);
