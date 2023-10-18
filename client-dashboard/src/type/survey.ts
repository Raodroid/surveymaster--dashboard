import { IProject } from './project';
import { IQuestionVersion } from '@/type/question-bank';
import { UserPayload } from '@/redux/user';

export enum SubSurveyFlowElement {
  BLOCK = 'Block',
  BRANCH = 'Branch',
  EMBEDDED_DATA = 'EmbeddedData',
  END_SURVEY = 'EndSurvey',
}

export enum BranchChoiceType {
  CHOICE_TEXT_ENTRY_VALUE = 'ChoiceTextEntryValue',
  SELECTABLE_CHOICE = 'SelectableChoice',
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
}

export interface SubBranchLogicDto {
  blockId: string;
  sort: number;
  conjunction: Conjunction;
  logicType: BranchLogicType;

  qId?: string;
  choiceType?: BranchChoiceType;
  optionSort?: number;
  leftOperand?: string;
  operator?: LogicOperator;
  rightOperand?: string;
}

export interface SubSurveyFlowElementDto {
  type: SubSurveyFlowElement;
  sort: number;
  blockDescription?: string;
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
  surveyVersionId: string;
  type: SubSurveyFlowElement;
  sort: number;
  blockDescription?: string;
  surveyQuestions?: ISurveyQuestionDto[];
  branchLogics?: SubBranchLogicDto[];
  listEmbeddedData?: SubEmbeddedDataDto[];
}

export interface ISurveyVersion {
  id?: string;
  displayId: string;
  name: string;
  remark?: string;
  questions?: ISurveyQuestion[];
  numberOfQuestions: number;
  survey?: ISurvey;
  status?: SurveyVersionStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
  surveyFlowElements: SurveyFlowElementResponseDto[];
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

  createdBy?: UserPayload;
  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export enum SurveyVersionStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
}
export interface ISurveyQuestionDto {
  questionVersionId: string;
  sort?: number;
  remark?: string;
  parameter?: string;
}

export interface ISurveyVersionBaseDto {
  name?: string;
  remark?: string | null;
  status?: SurveyVersionStatus;
  surveyFlowElements?: SubSurveyFlowElementDto[];
}

export interface CreateSurveyBodyDto {
  projectId: string;
  version?: ISurveyVersionBaseDto;
}

export interface IPostSurveyVersionBodyDto extends ISurveyVersionBaseDto {
  surveyId: string;
}

export interface IPutSurveyVersionBodyDto extends ISurveyVersionBaseDto {
  name: string;
  remark: string | null;
  status: SurveyVersionStatus;
  questions: ISurveyQuestionDto[];
}

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
