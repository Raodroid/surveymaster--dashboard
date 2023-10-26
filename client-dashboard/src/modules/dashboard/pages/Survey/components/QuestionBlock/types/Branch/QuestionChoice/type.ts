import { IQuestion } from '@/type';

export interface IQuestionChoiceComponent {
  fieldName: string;
  questionData: IQuestion | undefined;
}
