import React, { FC } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { TextEntry } from '.';

const DatePicker: FC<IQuestionChoiceComponent> = props => {
  return <TextEntry {...props} />;
};

export default DatePicker;
