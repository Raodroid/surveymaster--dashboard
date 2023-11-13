import React, { FC } from 'react';
import { IQuestionChoiceComponent } from '../type';
import { TextEntry } from './index';

const TextGraphic: FC<IQuestionChoiceComponent> = props => {
  return <TextEntry {...props} />;
};

export default TextGraphic;
