import React, { FC } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { TextEntry } from './index';

const Slider: FC<IQuestionChoiceComponent> = props => {
  return <TextEntry {...props} />;
};

export default Slider;
