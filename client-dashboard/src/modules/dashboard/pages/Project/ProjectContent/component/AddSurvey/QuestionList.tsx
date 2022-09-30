import { Button } from 'antd';
import React from 'react';
import { QuestionListWrapper } from './styles';

function QuestionList() {
  return (
    <QuestionListWrapper>
      <div className="title">Survey Question List</div>

      <div className="btn-wrapper flex">
        <Button>Add All Questions from One Category</Button>
        <Button type="primary">Add One More Question</Button>
      </div>
    </QuestionListWrapper>
  );
}

export default QuestionList;
