import { UserPayload } from 'redux/user';
import { ISurvey, ProjectTypes } from 'type';

export interface ProjectPayload {
  name?: string;
  id?: string;
  description?: string;
  personInCharge?: string;
  type: ProjectTypes | string;
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
