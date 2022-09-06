import { Action, ReducersMapObject } from 'redux';
import { RecordOf } from 'immutable';

import { AuthState } from './auth';
import { UserState } from './user';

export interface StandardAction<T = any, U = any, F = any> {
  type: string;
  payload?: T;
  error?: string;
  meta?: U;
  callback?: F;
}

export interface RootState {
  readonly auth: RecordOf<AuthState>;
  readonly user: RecordOf<UserState>;
}

export interface IPagination {
  page: number; // -> page number
  take: number; // -> page size
  itemCount: number; // -> total item count
}

export type Reducers = ReducersMapObject<RootState>;

export type MetaAction<Type, Meta, Error, Function> = Action<Type> & {
  meta?: Meta;
  error?: Error;
  callback?: Function;
};

export type PayloadAction<
  Type,
  Payload = void,
  Meta = void,
  Error = void,
  Function = () => void,
> = MetaAction<Type, Meta, Error, Function> & {
  readonly payload?: Payload;
};
