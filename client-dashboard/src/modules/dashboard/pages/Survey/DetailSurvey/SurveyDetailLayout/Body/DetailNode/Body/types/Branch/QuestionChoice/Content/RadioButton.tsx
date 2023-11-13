import React, { FC } from 'react';
import { IQuestionChoiceComponent } from '@pages/Survey/components/QuestionBlock/types/Branch/QuestionChoice/type';
import { MultipleChoice } from './index';

const RadioButton: FC<IQuestionChoiceComponent> = props => {
  return <MultipleChoice {...props} />;
};

export default RadioButton;
