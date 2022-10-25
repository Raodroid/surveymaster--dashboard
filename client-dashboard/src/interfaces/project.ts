import { UserPayload } from 'redux/user';
import { IProject, ISurvey, ISurveyQuestion, UserUpdatedDto } from 'type';

export interface CreateProject {
  name?: string;
  id?: string;
  description?: string;
  personInCharge?: string;
}

export interface UpdateProject {
  name?: string;
  id?: string;
  description?: string;
  personInCharge?: string;
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
