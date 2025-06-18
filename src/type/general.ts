import { CSSProperties, ReactNode } from 'react';

export interface Component {
  (props): JSX.Element;
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

export interface QsParams {
  q?: string;
  page?: number;
  take?: number;
  isDeleted?: string;
  createdFrom?: string;
  createdTo?: string;
  order?: 'ASC' | 'DESC';
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

export interface IOptionItem {
  label: string | ReactNode;
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

export type ActionThreeDropDownType<T> = {
  record: T;
  handleSelect: (input: { key: any; record: T; index?: number }) => void;
};

export interface IMenuItem {
  label: string | ReactNode;
  key: string;
  icon?: string | ReactNode;
  style?: CSSProperties;
  disabled?: boolean;
}

export type IModal = {
  open: boolean;
  toggleOpen: () => void;
};
