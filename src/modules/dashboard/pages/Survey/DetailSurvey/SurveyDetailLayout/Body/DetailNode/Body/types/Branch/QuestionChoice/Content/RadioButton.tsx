import { FC } from 'react';
import { MultipleChoice } from './index';
import { IQuestionChoiceComponent } from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/types/Branch/QuestionChoice/type';

const RadioButton: FC<IQuestionChoiceComponent> = props => {
  return <MultipleChoice {...props} />;
};

export default RadioButton;
