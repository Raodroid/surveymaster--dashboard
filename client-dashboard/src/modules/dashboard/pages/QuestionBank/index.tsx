import React from 'react';
import { QuestionBankWrapper, QuestionBankContentWrapper } from './style';
import QuestionBankSider from './QuestionBankSider';
import { Outlet } from 'react-router-dom';

const QuestionBank = () => {
  return (
    <QuestionBankWrapper>
      <QuestionBankSider />

      <QuestionBankContentWrapper>
        <Outlet />
      </QuestionBankContentWrapper>
    </QuestionBankWrapper>
  );
};

export default QuestionBank;
