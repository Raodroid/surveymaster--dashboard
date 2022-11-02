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

export interface ISurvey {
  id?: string;
  displayId: string;
  projectId: string;
  name: string;
  remark?: string;
  project?: IProject;
  questions?: ISurveyQuestion[];
  numberOfQuestions: number;

  createdBy: UserPayload;
  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export interface ISurveyQuestionDto {
  questionVersionId: string;
  sort?: number;
  remark?: string;
  parameter?: string;
}

export interface IPostSurveyBodyDto {
  name: string;
  projectId: string;
  remark?: string;
  questions?: ISurveyQuestionDto[];
  surveyId?: string;
}

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
