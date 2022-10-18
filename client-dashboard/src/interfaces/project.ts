import { UserPayload } from 'redux/user';
import { IProject, ISurveyQuestion } from 'type';

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
