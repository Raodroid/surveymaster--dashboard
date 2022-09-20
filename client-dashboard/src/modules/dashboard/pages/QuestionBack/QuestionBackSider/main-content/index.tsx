import React from 'react';
import { QuestionBankSiderMainContentWrapper } from './style';
import { mockCategories } from 'type';

const QuestionBankSiderMainContent = () => {
  return (
    <QuestionBankSiderMainContentWrapper>
      <div className={'active-status QuestionBankSiderMainContent__title'}>
        <h4>Question Bank</h4>
      </div>
      <div className={'QuestionBankSiderMainContent__body'}>
        <div className={'category-list'}>
          <div className={'a'}>
            {mockCategories.data.map(cate => (
              <div key={cate.id}>{cate.name}</div>
            ))}
          </div>
        </div>
      </div>
    </QuestionBankSiderMainContentWrapper>
  );
};

export default QuestionBankSiderMainContent;
