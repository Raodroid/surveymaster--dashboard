import { UserPayload } from 'redux/user';

export enum ReduxModules {
  AUTH = 'AUTH',
  USER = 'USER',
}

export enum ReduxModulesName {
  AUTH = 'auth',
  USER = 'user',
}

export const ReduxCollections = {
  [ReduxModules.USER]: 'users',
};

export enum IndexeKeys {
  DELETED_AT = 'deletedAt',
}

export const ReduxIndexes = {
  [ReduxModules.USER]: [IndexeKeys.DELETED_AT],
};
export interface ReduxCollectionType {
  [ReduxModules.USER]?: UserPayload[];
}

export type IndexesType = Record<IndexeKeys, Record<string, string[]>>;
