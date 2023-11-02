export const defaultUserAvatarSrc =
  '/tiny-Img/Photos/Avatar/amili-user-default-avatar.svg';
export const defaultCoachAvatarSrc =
  '/tiny-Img/Photos/Avatar/amili-coach-default-avatar.svg';

export interface Component {
  (props): JSX.Element;
}

export enum timeTypeTEnum {
  repeatTime = 'repeat',
  specialTime = 'special',
}

export enum sexEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum SortEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface HigherOrderComType {
  (Component): Component;
}

export interface IPagination {
  page?: number; // -> page number
  take?: number; // -> page size
  itemCount?: number; // -> total item count
  pageCount?: number; // -> total page count
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  q?: string;
  sortType?: string;
  deleted?: boolean;
}

export interface FetchParamsSelect {
  page?: number | null;
  take?: number | null;
  tenantId?: string | null;
  q?: string | null;
  addressType?: string | null;
  id?: string | null;
  projectId?: string;
  deleted?: boolean;
}

export interface PaginationResponse<T> {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  pageCount: number;
  take: number;
  page: number;
  data: T[];
}

export interface IOptionItem {
  label: string;
  value: string;
}

export interface IOptionGroupItem {
  label: string | undefined;
  options: { label: string; value: string; disabled?: boolean }[];
}

export type ObjectKey = Record<string | number, unknown>;

export type EmptyString<T> = { [K in keyof T]: T[K] | '' };

export type Replace<
  T,
  ReplacedKey extends keyof T,
  NewValue extends Record<ReplacedKey, unknown>,
> = {
  [K in keyof T]: K extends ReplacedKey ? NewValue[ReplacedKey] : T[K];
};
