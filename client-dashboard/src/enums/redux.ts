import { UserPayload } from 'redux/user';

export enum ReduxModules {
  AUTH = 'AUTH',
  TODO = 'TODO',
  USER = 'USER',
  CATEGORY = 'CATEGORY',
  TENANT = 'TENANT',
  PROFILE = 'PROFILE',
  PROJECTS = 'PROJECTS',
  ADDRESS = 'ADDRESS',
  ORDER = 'ORDER',
}

export enum ReduxModulesName {
  AUTH = 'auth',
  USER = 'user',
  TODO = 'todo',
  CATEGORY = 'category',
  TENANT = 'tenant',
  PROFILE = 'profile',
  PROJECTS = 'projects',
  ADDRESS = 'address',
  ORDER = 'order',
}

export const ReduxCollections = {
  [ReduxModules.TODO]: 'todos',
  [ReduxModules.CATEGORY]: 'categories',
  [ReduxModules.USER]: 'users',
  [ReduxModules.TENANT]: 'tenants',
  [ReduxModules.PROFILE]: 'profiles',
  [ReduxModules.PROJECTS]: 'projects',
  [ReduxModules.ADDRESS]: 'address',
  [ReduxModules.ORDER]: 'order',
};

export enum IndexeKeys {
  TODO_CATEGORY_ID = 'categoryId',
  CATEGORY_IS_DELETED = 'isDeleted',
  DELETED_AT = 'deletedAt',
}

export const ReduxIndexes = {
  [ReduxModules.TODO]: [IndexeKeys.TODO_CATEGORY_ID],
  [ReduxModules.CATEGORY]: [IndexeKeys.CATEGORY_IS_DELETED],
  [ReduxModules.USER]: [IndexeKeys.DELETED_AT],
  [ReduxModules.TENANT]: [IndexeKeys.DELETED_AT],
  [ReduxModules.PROFILE]: [IndexeKeys.DELETED_AT],
  [ReduxModules.PROJECTS]: [IndexeKeys.DELETED_AT],
};
export interface ReduxCollectionType {
  [ReduxModules.USER]?: UserPayload[];
}

export type IndexesType = Record<IndexeKeys, Record<string, string[]>>;
