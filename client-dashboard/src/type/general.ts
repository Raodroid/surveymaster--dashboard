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

export interface MetaPaging {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: MetaPaging;
}
