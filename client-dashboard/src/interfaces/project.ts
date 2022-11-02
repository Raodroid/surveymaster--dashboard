import { UserPayload } from 'redux/user';
import { ISurvey, ProjectTypes } from 'type';

export interface ProjectPayload {
  name?: string;
  id?: string;
  description?: string;
  personInCharge?: string;
  type: ProjectTypes | string;
}

export interface SurveyQuestionDto {
  questionVersionId: string;
  sort?: number;
  remark?: string;
}

export interface PostSurveyBodyDto {
  name: string;
  projectId: string;
  remark?: string;
  questions: SurveyQuestionDto[];
}

export interface PutSurveyBodyDto {
  name: string;
  remark?: string;
  questions: SurveyQuestionDto[];
}

export interface IAction {
  actionType: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  deletedAt: string;
  id: string;
  surveyId: string;
  params: string;
  survey?: ISurvey;
  owner: UserPayload;
}
