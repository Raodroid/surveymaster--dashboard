import React, { FC } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { TextEntry } from './index';

const TimePicker: FC<IQuestionChoiceComponent> = props => {
  return <TextEntry {...props} />;
};

export default TimePicker;
