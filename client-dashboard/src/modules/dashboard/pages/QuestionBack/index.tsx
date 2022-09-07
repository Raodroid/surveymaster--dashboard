import React from 'react';
import { QuestionBankWrapper } from './style';
import QuestionBackSider from './QuestionBackSider';
import QuestionBackContent from './QuestionBackContent';

const QuestionBank = () => {
  return (
    <QuestionBankWrapper>
      <QuestionBackSider />
      <QuestionBackContent />
    </QuestionBankWrapper>
  );
};

export default QuestionBank;
