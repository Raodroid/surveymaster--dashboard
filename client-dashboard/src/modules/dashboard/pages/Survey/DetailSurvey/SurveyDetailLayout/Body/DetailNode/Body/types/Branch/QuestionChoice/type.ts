import { IQuestionVersion } from '@/type';

export interface IQuestionChoiceComponent {
  fieldName: string;
  questionData: IQuestionVersion | undefined;
}
