import {
  CreateSurveyBodyDto,
  IQuestionVersion,
  ISurveyQuestionDto,
  ISurveyVersionBaseDto,
  QuestionType,
  Replace,
  SubSurveyFlowElementDto,
} from '@/type';
import { DataNode } from 'antd/es/tree';
import { ReactNode } from 'react';

type GeneralDataNode = Pick<
  DataNode,
  Exclude<keyof DataNode, 'title' | 'children'>
>;

type GeneralSurveyFlowElement = Omit<
  Replace<
    SubSurveyFlowElementDto,
    'surveyQuestions',
    { surveyQuestions: questionValueType[] }
  >,
  'children'
>;

type BasicSurveyNode = GeneralSurveyFlowElement &
  GeneralDataNode & {
    fieldName: string;
  };

type FieldDataNode<
  T,
  ChildFieldName extends string = 'children',
> = BasicSurveyNode &
  T &
  Partial<Record<ChildFieldName, FieldDataNode<T, ChildFieldName>[]>>;

export declare type SurveyDataTreeNode = FieldDataNode<{
  title?: ReactNode | ((data: SurveyDataTreeNode) => ReactNode);
}>;

type Version = Replace<
  ISurveyVersionBaseDto,
  'surveyFlowElements',
  {
    surveyFlowElements: SurveyDataTreeNode[];
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
}

export const rootSurveyFlowElementFieldName = 'version.surveyFlowElements';
