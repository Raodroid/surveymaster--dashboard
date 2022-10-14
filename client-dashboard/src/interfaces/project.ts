import { UserPayload } from 'redux/user';
import { IGetParams, IQuestionVersion } from 'type';

export interface IProject {
  id: string;
  name: string;
  displayId: string;
}

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

export interface ISurveyQuestion {
  id?: string;
  surveyId: string;
  questionVersionId: string;
  sort: number;
  survey?: ISurvey;
  remark?: string;
  questionVersion?: IQuestionVersion;
}
export interface UpdateSurvey {
  id: string;
  name: string;
  remark: string;
  questions: ISurveyQuestion[];
  projectId: string;
}

export interface SurveyQuestionDto {
  questionVersionId: string;
  sort: number;
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
