import React from 'react';
import { QuestionBankWrapper, QuestionBackContentWrapper } from './style';
import QuestionBankSider from './QuestionBankSider';
import { Outlet } from 'react-router-dom';

const QuestionBank = () => {
  return (
    <QuestionBankWrapper>
      <QuestionBankSider />

      <QuestionBackContentWrapper>
        <Outlet />
      </QuestionBackContentWrapper>
    </QuestionBankWrapper>
  );
};

export default QuestionBank;
