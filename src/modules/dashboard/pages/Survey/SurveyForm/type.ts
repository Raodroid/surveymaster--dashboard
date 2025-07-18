import {
  CreateSurveyBodyDto,
  IQuestionVersion,
  ISurveyQuestionDto,
  ISurveyVersionBaseDto,
  QuestionType,
  Replace,
  SubBranchLogicDto,
  SubSurveyFlowElementDto,
} from '@/type';
import { DataNode } from 'antd/es/tree';
import { ReactNode } from 'react';

export type ExtraSubBranchLogicDto = SubBranchLogicDto & {
  blockSort_qId: string;
  row_column_BranchChoiceType?: string;
  questionType?: QuestionType;
};

type GeneralDataNode = Omit<DataNode, 'title' | 'children'>;

type GeneralSurveyFlowElement = Omit<
  SubSurveyFlowElementDto,
  'branchLogics' | 'surveyQuestions' | 'children'
> & {
  surveyQuestions: questionValueType[];
  branchLogics: ExtraSubBranchLogicDto[];
};

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
  questionVersion?: IQuestionVersion;
};

export interface IEditSurveyFormValues
  extends Replace<
    CreateSurveyBodyDto,
    'version',
    {
      version: Version;
    }
  > {
  createdAt?: string | Date | null;
  surveyId: string;
  surveyVersionId?: string;
  selectedRowKeys: string[]; //for external survey only
}

export const rootSurveyFlowElementFieldName = 'version.surveyFlowElements';
