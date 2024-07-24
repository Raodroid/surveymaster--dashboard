import { IProject } from './project';
import { IQuestionVersion } from '@/type/question-bank';
import { UserPayload } from '@/redux/user';
import { SurveyTemplateEnum } from '@pages/Survey';

export enum SubSurveyFlowElement {
  BLOCK = 'Block',
  BRANCH = 'Branch',
  EMBEDDED_DATA = 'EmbeddedData',
  END_SURVEY = 'EndSurvey',
}

export enum BranchChoiceType {
  CHOICE_TEXT_ENTRY_VALUE = 'ChoiceTextEntryValue',
  SELECTABLE_CHOICE = 'SelectableChoice',
  SELECTABLE_ANSWER = 'SelectableAnswer',
  SELECTED_ANSWER_COUNT = 'SelectedAnswerCount',
  SELECTED_ANSWER_RECODE = 'SelectedAnswerRecode',
  CHOICE_NUMERIC_ENTRY_VALUE = 'ChoiceNumericEntryValue',
}

export enum Conjunction {
  AND = 'And',
  OR = 'Or',
}
export enum BranchLogicType {
  QUESTION = 'Question',
  EMBEDDED_FIELD = 'EmbeddedField',
}

export enum LogicOperator {
  EQUAL_TO = 'EqualTo',
  NOT_EQUAL_TO = 'NotEqualTo',
  GREATER_THAN = 'GreaterThan',
  GREATER_THAN_OR_EQUAL = 'GreaterThanOrEqual',
  LESS_THAN = 'LessThan',
  LESS_THAN_OR_EQUAL = 'LessThanOrEqual',
  EMPTY = 'Empty',
  NOT_EMPTY = 'NotEmpty',
  CONTAINS = 'Contains',
  DOES_NOT_CONTAIN = 'DoesNotContain',
  SELECTED = 'Selected',
  NOT_SELECTED = 'NotSelected',
}
export interface SubEmbeddedDataDto {
  field: string;
  value: string;
  id?: string;
}

export interface SubBranchLogicDto {
  id?: string;
  sort: number;
  conjunction: Conjunction;
  logicType: BranchLogicType;
  blockSort?: number;

  questionVersionId?: string;
  choiceType?: BranchChoiceType;
  optionSort?: number;
  leftOperand?: string;
  operator?: LogicOperator;
  rightOperand?: string;
  column?: number; //index +1
  row?: number; //index+1
}

export interface SubSurveyFlowElementDto {
  id?: string;
  type: SubSurveyFlowElement;
  endMessageId?: string;
  sort: number;
  blockDescription?: string;
  blockSort?: number;
  surveyQuestions?: ISurveyQuestionDto[];
  branchLogics?: SubBranchLogicDto[];
  listEmbeddedData?: SubEmbeddedDataDto[];
  children?: SubSurveyFlowElementDto[];
}
export interface SurveyFlowElementResponseDto {
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
  id: string;
  blockId: string;
  blockSort?: number;
  surveyVersionId: string;
  type: SubSurveyFlowElement;
  sort: number;
  blockDescription?: string;
  surveyQuestions?: Array<
    ISurveyQuestionDto & {
      id: string;
      createdAt: string;
      updatedAt: string | Date;
      deletedAt: string | Date;
      surveyId: string;
      questionVersionId: string;
      remark: string;
      parameter: string;
      sort: number;
      createdBy: string;
      deletedBy: string;
      questionVersion: IQuestionVersion;
    }
  >;
  branchLogics?: SubBranchLogicDto[];
  listEmbeddedData?: SubEmbeddedDataDto[];
  children?: SurveyFlowElementResponseDto[];
}

export interface ISurveyVersion {
  id?: string;
  displayId: string;
  approvalUserId?: string;
  isAwaitingDeletion?: boolean;

  name: string;
  remarks?: ISurveyRemark[];
  status?: SurveyVersionStatus;
  surveyFlowElements?: SurveyFlowElementResponseDto[];

  survey?: ISurvey;
  surveyId?: string;

  createdBy?: string;
  updatedBy?: UserPayload;
  deletedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export interface ISurveyQuestion {
  id?: string;
  surveyId: string;
  questionVersionId: string;
  sort: number;
  survey?: ISurvey;
  remark?: string;
  questionVersion?: IQuestionVersion;
  parameter?: string;
}

export interface ISurvey {
  id?: string;
  displayId: string;
  projectId: string;
  latestVersion?: ISurveyVersion;
  latestCompletedVersion?: ISurveyVersion;
  versions?: ISurveyVersion[];
  project?: IProject;
  isAwaitingDeletion?: boolean;

  createdBy?: string;
  updatedBy?: UserPayload;
  deletedBy?: string;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export enum SurveyVersionStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  AWAIT_APPROVAL = 'AWAIT_APPROVAL',
}
export interface ISurveyQuestionDto {
  questionVersionId: string;
  sort?: number;
  remarks?: IQuestionRemark[];
  parameter?: string;
  id?: string;
}

export interface ISurveyVersionBaseDto {
  id?: string;
  name?: string;
  remarks?: ISurveyRemark[] | null;
  status?: SurveyVersionStatus;
  surveyFlowElements?: SubSurveyFlowElementDto[];
}

export interface EditSurveyBodyDto {
  projectId: string;
  version?: ISurveyVersionBaseDto;
  template?: SurveyTemplateEnum | string;
  duplicateSurveyId?: string;
}

export interface CreateSurveyBodyDto {
  projectId: string;
  version?: Omit<ISurveyVersionBaseDto, 'remarks'> & {
    remarks: string[];
  };
  template?: SurveyTemplateEnum | string;
  duplicateSurveyId?: string;
}

export type DuplicateSurveyVersionDto = {
  version: {
    name: string;
    remarks: string[];
  };
  surveyId: string;
};
export interface IPostSurveyVersionBodyDto extends ISurveyVersionBaseDto {
  surveyId: string;
}

export type IPutSurveyVersionBodyDto = ISurveyVersionBaseDto;

export interface IPutSurveyVersionBodyDtoExtendId
  extends IPutSurveyVersionBodyDto {
  surveyVersionId?: string;
}

export enum surveyActionType {
  SURVEY_CLOSE = 'SURVEY_CLOSE',
  SURVEY_ACTIVATE = 'SURVEY_ACTIVATE',
  SURVEY_VERSION_CREATED = 'SURVEY_VERSION_CREATED',
  SURVEY_VERSION_CLOSE = 'SURVEY_VERSION_CLOSE',
  SURVEY_VERSION_ACTIVATE = 'SURVEY_VERSION_ACTIVATE',
  CHANGE_SURVEY_VERSION_NAME = 'CHANGE_SURVEY_VERSION_NAME',
  CHANGE_SURVEY_VERSION_REMARK = 'CHANGE_SURVEY_VERSION_REMARK',
  CHANGE_SURVEY_VERSION_STATUS = 'CHANGE_SURVEY_VERSION_STATUS',
  ADD_QUESTION = 'ADD_QUESTION',
  REMOVE_QUESTION = 'REMOVE_QUESTION',
  CHANGE_ORDER_QUESTION = 'CHANGE_ORDER_QUESTION',
  UPDATE_VERSION_QUESTION = 'UPDATE_VERSION_QUESTION',
  // CHANGE_PERSON_IN_CHARGE = 'CHANGE_PERSON_IN_CHARGE',
  // ADD_QUESTION_BY_ADD_CATEGORY = 'ADD_QUESTION_BY_ADD_CATEGORY',
}

export interface ISurveyRemark {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  deletedAt?: string;
  id: string;
  questionId: string;
  owner: UserPayload;
  remark: string;
}
export interface IQuestionRemark {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  deletedAt?: string;
  id?: string;
  questionId?: string;
  owner?: UserPayload;
  remark: string;
}

export interface IUpdateSurveyVersionStatusDto {
  status: SurveyVersionStatus;
  approvalUserId: string;
}
