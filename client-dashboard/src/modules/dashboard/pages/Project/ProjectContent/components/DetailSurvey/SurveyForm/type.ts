import {
  CreateSurveyBodyDto,
  IQuestionVersion,
  ISurveyQuestionDto,
  ISurveyVersionBaseDto,
  QuestionType,
  Replace,
  SubSurveyFlowElementDto,
} from '@/type';

type ExtraSurveyFlowElement = Replace<
  SubSurveyFlowElementDto,
  'surveyQuestions',
  {
    surveyQuestions: questionValueType[];
  }
>;

type Version = Replace<
  ISurveyVersionBaseDto,
  'surveyFlowElements',
  {
    surveyFlowElements: SurveyFlowElements[];
  }
>;
export enum SurveyTemplateEnum {
  NEW = 'NEW',
  DUPLICATE = 'DUPLICATE',
}

export type questionValueType = ISurveyQuestionDto & {
  type: QuestionType | string;
  category: string;
  id?: string;
  questionTitle: string;
  versions?: IQuestionVersion[];
  createdAt?: string | Date | null;
};

export type SurveyFlowElements = Replace<
  ExtraSurveyFlowElement,
  'children',
  {
    children: SurveyFlowElements[];
  }
>;

export interface IAddSurveyFormValues
  extends Replace<
    CreateSurveyBodyDto,
    'version',
    {
      version: Version;
    }
  > {
  createdAt?: string | Date | null;
  template: SurveyTemplateEnum | string;
  duplicateSurveyId?: string;
  surveyId: string;
  surveyVersionId?: string;
  questionIdMap?: Record<
    string,
    {
      questionTitle: string;
      versions: IQuestionVersion[];
      createdAt: string | Date | null;
    } // object of { [questionVersionId] : {questionTitle: string, versions: version.id[]}}
  >;
  selectedRowKeys?: string[];
}
