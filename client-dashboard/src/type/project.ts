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
  personResponsible?: UserPayload;
  createdBy?: UserPayload;

  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}
