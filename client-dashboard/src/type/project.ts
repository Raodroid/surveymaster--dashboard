import { IGetParams, IQuestionVersion } from 'type';
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
  remark?: string;
  status?: SurveyVersionStatus;
  questions?: ISurveyQuestionDto[];
}

export interface IPostSurveyBodyDto {
  projectId: string;
  version?: ISurveyVersionBaseDto;
}

export interface IPostSurveyBodyDtoExtendId extends IPutSurveyBodyDto {
  surveyVersionId?: string;
}

export interface IPostSurveyVersionBodyDto extends ISurveyVersionBaseDto {
  surveyVersionId: string;
}

export interface IPutSurveyVersionBodyDto extends ISurveyVersionBaseDto {}

export interface IPutSurveyBodyDto {
  name: string;
  remark?: string;
  questions: ISurveyQuestionDto[];
}
export interface IPutSurveyBodyDtoExtendId extends IPutSurveyBodyDto {
  id?: string;
}

export enum surveyActionType {
  SURVEY_CLOSE = 'SURVEY_CLOSE',
  SURVEY_CREATED = 'SURVEY_CREATED',
  SURVEY_ACTIVATE = 'SURVEY_ACTIVATE',

  ADD_QUESTION = 'ADD_QUESTION',
  UPDATE_QUESTION = 'UPDATE_QUESTION',
  REMOVE_QUESTION = 'REMOVE_QUESTION',

  CHANGE_SURVEY_NAME = 'CHANGE_SURVEY_NAME',
  CHANGE_SURVEY_REMARK = 'CHANGE_SURVEY_REMARK',
  CHANGE_ORDER_QUESTION = 'CHANGE_ORDER_QUESTION',
}

export type GetListSurveyDto = IGetParams & {
  projectId: string;
  minNumberOfQuestions?: number;
  maxNumberOfQuestions?: number;
};
