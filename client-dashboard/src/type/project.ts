import { IQuestionVersion } from 'type';
import { UserPayload } from '../redux/user';

export enum ProjectTypes {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export interface IProject {
  id: string;
  displayId: string;
  name: string;
  type: ProjectTypes;
  description: string;
  personInCharge: string;
  personResponsible: UserPayload;
  createdBy: UserPayload;

  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
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
}

export interface ISurvey {
  id?: string;
  displayId: string;
  projectId: string;
  latestVersion?: ISurveyVersion;
  latestCompletedVersion?: ISurveyVersion;
  versions?: ISurveyVersion[];
  project?: IProject;

  createdBy: UserPayload;
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
  questions?: ISurveyQuestionDto[];
}

export interface IPostSurveyBodyDto {
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
