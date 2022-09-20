import React from 'react';
import { QuestionBankWrapper } from './style';
import QuestionBankSider from './QuestionBackSider';
import QuestionBackContent from './QuestionBackContent';

const QuestionBank = () => {
  return (
    <QuestionBankWrapper>
      <QuestionBankSider />
      <QuestionBackContent />
    </QuestionBankWrapper>
  );
};

export default QuestionBank;
