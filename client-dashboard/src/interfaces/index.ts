export * from './project';

import { BooleanEnum } from 'type';

export interface Test {
  a: string;
}

export interface UserUpdatedDto {
  // roles: number[]; Don't allow user update their role by this api
  id?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  phonePrefix?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  displayName?: string; // new field
}

export interface InviteMember {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  description?: string;
  roles?: number[];
}

export interface UpdateMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  description?: string;
  roles?: number[];
}
