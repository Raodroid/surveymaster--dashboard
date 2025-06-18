import { IndexesType } from 'enums';

export interface UserState {
  isFetching: boolean;
  users: Record<string, UserPayload>;
  error?: null | string;
  isChangePassword: boolean;
  indexes: IndexesType;
}
export enum ScopeEntity {
  users = 'users',
}

export enum ScopeAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
export interface Scope {
  id: number;
  action: ScopeAction;
  roleId: number;
  name: string;
  entity: ScopeEntity;
  metadata: any;
}

export interface Role {
  id: number;
  name: string;
  scopes?: Scope[];
  scope?: any;
}

export interface UserPayload {
  id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  userName?: string;
  phone?: string;
  description?: string;
  roles?: Array<Role>;

  password?: string;
  phonePrefix?: string;
  roleData?: Role[];
  tenantId?: string;
  smsVerified?: boolean;
  displayId?: string;
  avatar?: string;
  finishTourOnMyMicrobiome?: boolean;
  finishTourOnMyScore?: boolean;
  finishTourOnHomePage?: boolean;
  country?: string;
  userRoles?: Record<string, any>[];
  disabledNotificationTypes?: any;
  departmentName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
}

export interface ChangeUserPasswordPayload {
  userId: string;
  password: string;
}
