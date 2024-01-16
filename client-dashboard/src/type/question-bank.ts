import { UserPayload } from '../redux/user';
import { ProjectTypes } from '@/type/project';
import { RoleEnum } from '@/enums';

export interface UserUpdatedDto {
  // roles: number[]; Don't allow user update their role by this api
  firstName: string;
  lastName: string;
  description: string;
  phonePrefix: string;
  phone: string;
  avatar: string;
  scientificDegree: string; // new field
}

export interface IQuestion {
  id?: string;
  approvalUserId?: string;
  displayId: string;
  latestCompletedVersion: IQuestionVersion;
  latestVersion: IQuestionVersion;
  versions: IQuestionVersion[];
  masterCategoryId: string;
  masterCategory?: IQuestionCategory;
  masterSubCategoryId?: string;
  masterSubCategory?: IQuestionCategory;
  masterVariableName: string;
  masterCombineTokenString: string;

  createdBy: UserPayload;
  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export interface IQuestionVersion {
  approvalUserId?: string;
  id?: string;
  displayId: string;
  questionId: string;
  latestVersionOfQuestionId?: string;
  latestCompletedVersionOfQuestionId?: string;
  latestOfQuestion?: IQuestion;
  latestCompletedOfQuestion?: IQuestion;
  question?: IQuestion;
  title: string;
  type: QuestionType;
  status?: QuestionVersionStatus;
  numberStep?: number;
  numberMin?: number;
  numberMax?: number;
  maxDecimal?: number;
  matrixType?: MatrixType;
  dataMatrix?: IDataMatrixInfo;
  timeFormat?: TimeFormat;
  dateFormat?: DateFormat;
  image?: string;
  numberValidationMax?: number;
  numberValidationMin?: number;
  textValidationMax?: number;
  textValidationMin?: number;
  textValidationRegex?: string;

  options?: IQuestionVersionOption[];

  createdBy: UserPayload;
  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export interface IQuestionVersionOption {
  id?: string;
  questionVersionId?: string;
  questionVersion?: IQuestionVersion;
  sort: number;
  imageUrl?: string;
  keyPath?: string;
  text?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  RADIO_BUTTONS = 'RADIO_BUTTONS',
  PHOTO = 'PHOTO',
  DATE_PICKER = 'DATE_PICKER',
  TIME_PICKER = 'TIME_PICKER',
  SLIDER = 'SLIDER',
  TEXT_ENTRY = 'TEXT_ENTRY',
  SIGNATURE = 'SIGNATURE',
  DATA_MATRIX = 'DATA_MATRIX',
  FORM_FIELD = 'FORM_FIELD',
  TEXT_GRAPHIC = 'TEXT_GRAPHIC',
  TEXT_NUMBER = 'TEXT_NUMBER',
  RANK_ORDER = 'RANK_ORDER',
}

export enum TimeFormat {
  TWELVE_HOUR = 'TWELVE_HOUR',
  TWENTY_FOUR_HOUR = 'TWENTY_FOUR_HOUR',
}

export enum DateFormat {
  DD_MM_YYYY = 'DD_MM_YYYY',
  MM_DD_YYYY = 'MM_DD_YYYY',
  YYYY_MM_DD = 'YYYY_MM_DD',
}

export enum QuestionVersionStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  AWAIT_APPROVAL = 'AWAIT_APPROVAL',
}

export interface IQuestionCategory {
  id?: string;
  name: string;
  parentCategoryId?: string;
  parent?: IQuestionCategory;
  children?: IQuestionCategory[];

  createdBy: UserPayload;
  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export const mockUser: UserPayload = {
  firstName: 'Van',
  lastName: 'Bui',
  fullName: 'Van Bui',
};

export const completedVersion: IQuestionVersion = {
  id: '1.1',
  displayId: '291',
  questionId: '1',
  title: 'What is your name?',
  type: QuestionType.TEXT_ENTRY,
  latestCompletedVersionOfQuestionId: '1',
  status: QuestionVersionStatus.COMPLETED,
  createdBy: mockUser,
  createdAt: new Date(),
};

export const draftVersion: IQuestionVersion = {
  id: '1.2',
  displayId: '296',
  questionId: '1',
  latestVersionOfQuestionId: '1',
  title: 'What is your gender?',
  type: QuestionType.RADIO_BUTTONS,
  status: QuestionVersionStatus.COMPLETED,
  createdBy: mockUser,
  options: [
    {
      id: '1.2.1',
      questionVersionId: '1.2',
      sort: 1,
      text: 'Male',
    },
    {
      id: '1.2.2',
      questionVersionId: '1.2',
      sort: 2,
      text: 'Female',
    },
    {
      id: '1.2.3',
      questionVersionId: '1.2',
      sort: 3,
      text: 'Other',
    },
  ],
  createdAt: new Date(),
};

export interface IPaginationResponse<T> {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  pageCount: number;
  take: number;
  page: number;
  data: T[];
}

export const mockCategories: IPaginationResponse<IQuestionCategory> = {
  hasNextPage: false,
  hasPreviousPage: false,
  itemCount: 2,
  pageCount: 1,
  page: 1,
  take: 10,
  data: [
    {
      id: '1',
      name: 'Category A',
      createdBy: mockUser,
      createdAt: new Date(),
      children: [
        {
          id: '1.1',
          name: 'Category A - 1',
          parentCategoryId: '1',
          createdBy: mockUser,
          createdAt: new Date(),
        },
        {
          id: '1.2',
          name: 'Category A - 2',
          parentCategoryId: '1',
          createdBy: mockUser,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '2',
      name: 'Category B',
      createdBy: mockUser,
      createdAt: new Date(),
      children: [
        {
          id: '2.1',
          name: 'Category B - 1',
          parentCategoryId: '2',
          createdBy: mockUser,
          createdAt: new Date(),
        },
        {
          id: '2.2',
          name: 'Category B - 2',
          parentCategoryId: '2',
          createdBy: mockUser,
          createdAt: new Date(),
        },
      ],
    },
  ],
};

export const QuestionDetail: IQuestion = {
  id: '1',
  displayId: '113-2121',
  latestCompletedVersion: completedVersion,
  latestVersion: draftVersion,
  versions: [draftVersion, completedVersion],
  masterCategoryId: '1',
  masterCategory: mockCategories.data[0],
  masterSubCategoryId: '1.1',
  masterSubCategory:
    mockCategories &&
    mockCategories.data[0] &&
    mockCategories.data[0].children &&
    mockCategories.data[0].children[0],
  masterVariableName: 'name',
  masterCombineTokenString: 'name-1.1',
  createdBy: mockUser,
  createdAt: new Date(),
};

export interface BaseParameterDto {
  displayId: string;
}

export interface IBaseQuestionOptionsVersionDto {
  sort: number;
  imageUrl?: string;
  text?: string;
  keyPath?: string;
  id?: number | string; //just useful in case for drag drop
}
export interface IDataMatrixInfo {
  rows: { id?: number; name: string; keyPath: string; image?: string }[];
  columns: { id?: number; name: string }[];
}
export enum MatrixType {
  RADIO_BUTTON = 'RADIO_BUTTON',
  TEXT_INPUT = 'TEXT_INPUT',
}
export interface BaseQuestionVersionDto {
  id?: string;
  type: QuestionType;
  title: string;
  status?: QuestionVersionStatus;
  numberStep?: number;
  numberValidationMax?: number;
  numberValidationMin?: number;
  textValidationMax?: number;
  textValidationMin?: number;
  textValidationRegex?: string;
  numberMin?: number;
  numberMinLabel?: string;
  numberMax?: number;
  numberMaxLabel?: string;
  maxDecimal?: number | null;
  options?: IBaseQuestionOptionsVersionDto[];
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  dataMatrix?: IDataMatrixInfo;
  image?: string;
  matrixType?: MatrixType;
}

export type QuestionParameter = BaseParameterDto & {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
  masterCombineTokenString: string;
  version: BaseQuestionVersionDto;
};

export type IQuestionCreatePostDto = QuestionParameter;

// We only use version object for put
export interface IQuestionVersionPostNewDto {
  questionId: string;
  version: BaseQuestionVersionDto;
}

export interface IQuestionVersionPutUpdateDto {
  version: BaseQuestionVersionDto;
}

// All fields on version field are optional
export interface IQuestionVersionPatchUpdateDto {
  version: Partial<BaseQuestionVersionDto>;
}

export interface IQuestionVersionPatchUpdateDtoExtendId
  extends IQuestionVersionPatchUpdateDto {
  id: string;
  approvalUserId: string;
}

export interface IQuestionVersionPutUpdateDtoExtendId
  extends IQuestionVersionPutUpdateDto {
  id: string;
}

export interface IGetParams {
  q?: string;
  take?: number;
  page?: number;
  ids?: number[] | string[];
  createdFrom?: string;
  createdTo?: string;
  isDeleted?: boolean;
  selectAll?: boolean;
  order?: 'DESC' | 'ASC';
  roleIds?: RoleEnum[];
}

export type GetListQuestionDto = IGetParams & {
  types?: QuestionType[];
  hasLatestCompletedVersion?: boolean;
  body?: {
    masterVariableNames?: string[];
    categoryIds?: string[];
    subCategoryIds?: string[];
  };
};

export type ProjectQueryParam = IGetParams & {
  types?: ProjectTypes[];
  hasLatestCompletedVersion?: boolean;
  body?: {
    masterVariableNames?: string[];
    categoryIds?: string[];
    subCategoryIds?: string[];
  };
};

export interface IUpdateQuestionVersionStatusDto {
  status: QuestionVersionStatus;
  approvalUserId: string;
}
