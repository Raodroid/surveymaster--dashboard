import { UserPayload } from 'redux/user';
import { PaginationResponse } from './general';

export interface ISurveyQuestion {
  isMaskQuestion?: boolean;
  id: string;
  title?: string;
  description?: string;
  defaultKeyPath: string;
  type: QuestionType;
  isRequired: boolean;
  isSingleChoice?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hint?: string;
  showTitleAsHTML?: boolean;
}

export interface IQuestion {
  id?: string;
  displayId: string;
  latestCompletedVersionId: string;
  latestVersionId: string;
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

interface IQuestionVersion {
  id?: string;
  displayId: string;
  questionId: string;
  question?: ISurveyQuestion;
  title: string;
  type: QuestionType;
  status?: QuestionVersionStatus;
  numberStep?: number;
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

interface IQuestionVersionOption {
  id?: string;
  questionVersionId: string;
  questionVersion?: IQuestionVersion;
  sort: number;
  imageUrl?: string;
  text?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = '',
  RADIO_BUTTONS = 'RADIO_BUTTONS',
  PHOTO = 'PHOTO',
  DATE_PICKER = 'DATE_PICKER',
  TIME_PICKER = 'TIME_PICKER',
  SLIDER = 'SLIDER',
  TEXT_ENTRY = 'TEXT_ENTRY',
  // Will add more later
}

enum QuestionVersionStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
}

interface IQuestionCategory {
  id?: string;
  name: string;
  parentCategoryId?: string;
  parent?: IQuestionCategory;
  childs?: IQuestionCategory[];

  createdBy: UserPayload;
  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

const mockUser: UserPayload = {
  firstName: 'Van',
  lastName: 'Bui',
  fullName: 'Van Bui',
};

const completedVersion: IQuestionVersion = {
  id: '1.1',
  displayId: '291',
  questionId: '1',
  title: 'What is your name?',
  type: QuestionType.TEXT_ENTRY,
  status: QuestionVersionStatus.COMPLETED,
  createdBy: mockUser,
  createdAt: new Date(),
};

const draftVersion: IQuestionVersion = {
  id: '1.2',
  displayId: '296',
  questionId: '1',
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

export const mockCategories: PaginationResponse<IQuestionCategory> = {
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
      childs: [
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
      childs: [
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

export const mockQuestionList: PaginationResponse<IQuestion> = {
  hasNextPage: false,
  hasPreviousPage: false,
  itemCount: 2,
  pageCount: 1,
  page: 1,
  take: 10,
  data: [
    {
      id: '1',
      displayId: '113-2121',
      latestCompletedVersionId: '1.1',
      latestVersionId: '1.2',
      latestCompletedVersion: completedVersion,
      latestVersion: draftVersion,
      versions: [draftVersion, completedVersion],
      masterCategoryId: '1',
      masterCategory: mockCategories.data[0],
      masterSubCategoryId: '1.1',
      masterSubCategory:
        mockCategories &&
        mockCategories.data[0] &&
        mockCategories.data[0].childs &&
        mockCategories.data[0].childs[0],
      masterVariableName: 'name',
      masterCombineTokenString: 'name-1.1',
      createdBy: mockUser,
      createdAt: new Date(),
    },
    {
      id: '2',
      displayId: '113-2121',
      latestCompletedVersionId: '1.1',
      latestVersionId: '1.2',
      latestCompletedVersion: completedVersion,
      latestVersion: draftVersion,
      versions: [draftVersion, completedVersion],
      masterCategoryId: '1',
      masterCategory: mockCategories.data[0],
      masterSubCategoryId: '1.1',
      masterSubCategory:
        mockCategories &&
        mockCategories.data[0] &&
        mockCategories.data[0].childs &&
        mockCategories.data[0].childs[0],
      masterVariableName: 'name',
      masterCombineTokenString: 'name-1.1',
      createdBy: mockUser,
      createdAt: new Date(),
    },
  ],
};

export const QuestionListDetail: IQuestion = {
  id: '1',
  displayId: '113-2121',
  latestCompletedVersionId: '1.1',
  latestVersionId: '1.2',
  latestCompletedVersion: completedVersion,
  latestVersion: draftVersion,
  versions: [draftVersion, completedVersion],
  masterCategoryId: '1',
  masterCategory: mockCategories[0],
  masterSubCategoryId: '1.1',
  masterSubCategory:
    mockCategories &&
    mockCategories[0] &&
    mockCategories[0].childs &&
    mockCategories[0].childs[0],
  masterVariableName: 'name',
  masterCombineTokenString: 'name-1.1',
  createdBy: mockUser,
  createdAt: new Date(),
};

interface BaseParameterDto {
  display: string;
}

interface BaseQuestionVersionDto {
  sort: number;
  imageUrl?: string;
  text?: string;
}

interface BaseQuestionVersionDto {
  type: QuestionType;
  title: string;
  status?: QuestionVersionStatus;
  numberStep?: number;
  numberValidationMax?: number;
  numberValidationMin?: number;
  textValidationMax?: number;
  textValidationMin?: number;
  textValidationRegex?: string;
  options?: BaseQuestionVersionDto[];
}

type QuestionParameter = BaseParameterDto & {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
  masterCombineTokenString: string;
  version: BaseQuestionVersionDto;
};
