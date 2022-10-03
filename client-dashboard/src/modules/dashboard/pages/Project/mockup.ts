export interface UserUpdatedDto {
  // roles: number[]; Don't allow user update their role by this api
  firstName: string;
  lastName: string;
  description: string;
  phonePrefix: string;
  phone: string;
  avatar: string;
  displayName: string; // new field
  scientificDegree: string; // new field
}

interface UserPayload {
  firstName: string;
  lastName: string;
  fullName: string;
}

interface IQuestion {
  id?: string;
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

interface IQuestionVersion {
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

enum QuestionType {
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
  children?: IQuestionCategory[];

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
  latestCompletedVersionOfQuestionId: '1',
  status: QuestionVersionStatus.COMPLETED,
  createdBy: mockUser,
  createdAt: new Date(),
};

const draftVersion: IQuestionVersion = {
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

interface IPaginationResponse<T> {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  pageCount: number;
  take: number;
  page: number;
  data: T[];
}

const mockCategories: IPaginationResponse<IQuestionCategory> = {
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

const mockQuestionList: IPaginationResponse<IQuestion> = {
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
    },
    {
      id: '2',
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
    },
  ],
};
const QuestionListDetail: IQuestion = {
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

interface BaseParameterDto {
  displayId: string;
}

interface IBaseQuestionOptionsVersionDto {
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
  options?: IBaseQuestionOptionsVersionDto[];
}

type QuestionParameter = BaseParameterDto & {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
  masterCombineTokenString: string;
  version: BaseQuestionVersionDto;
};

type QuestionCreatePostDto = QuestionParameter;

// We only use version object for put
interface IQuestionVersionPostNewDto {
  quetionId: string;
  version: BaseQuestionVersionDto;
}

interface IQuestionVersionPutUpdateDto {
  version: BaseQuestionVersionDto;
}

// All fields on version field are optional
interface IQuestionVersionPatchUpdateDto {
  version: Partial<BaseQuestionVersionDto>;
}
export enum BooleanEnum {
  TRUE = 'true',
  FALSE = 'false',
}

interface IGetParams {
  q?: string;
  take?: number;
  page?: number;
  ids?: number[] | string[];
  createdFrom?: string;
  createdTo?: string;
  isDeleted?: BooleanEnum;
  selectAll?: BooleanEnum;
}

type GetListQuestionDto = IGetParams & {
  categoryIds?: string[];
  subCategoryIds?: string[];
  types?: QuestionType[];
};

type GetListSurveyDto = IGetParams & {
  projectId: string;
  minNumberOfQuestions?: number;
  maxNumberOfQuestions?: number;
};

interface IProject {
  id: string;
  name: string;
  displayId: string;
}

interface ISurveyQuestion {
  id?: string;
  surveyId: string;
  questionVersionId: string;
  sort: number;
  survey?: ISurvey;
  questionVersion?: IQuestionVersion;
}

interface ISurvey {
  id?: string;
  displayId: string;
  projectId: string;
  name: string;
  remark?: string;
  project?: IProject;
  questions?: ISurveyQuestion[];

  createdBy: UserPayload;
  updatedBy?: UserPayload;
  deletedBy?: UserPayload;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}

export const mockSurveyList: IPaginationResponse<ISurvey> = {
  hasNextPage: false,
  hasPreviousPage: false,
  itemCount: 2,
  pageCount: 1,
  page: 1,
  take: 10,
  data: [
    {
      id: '1',
      displayId: '111-22',
      projectId: 'p1',
      name: 'Microbiome Donor Programme (AMD)',
      remark:
        'Quisque malesuada placerat nisl. Nulla facilisi. Pellentesque auctor neque nec urna. Pellentesque dapibus hendrerit tortor. Donec vitae sapien ut libero venenatis faucibus.',
      project: {
        id: 'p1',
        displayId: '111-23',
        name: 'FFQ',
      },
      questions: [
        {
          id: '1',
          questionVersionId: '1',
          surveyId: '1',
          sort: 1,
        },
        {
          id: '2',
          questionVersionId: '2',
          surveyId: '1',
          sort: 2,
        },
        {
          id: '3',
          questionVersionId: '2',
          surveyId: '1',
          sort: 3,
        },
      ],
      createdBy: mockUser,
      createdAt: new Date(),
    },
    {
      id: '2',
      displayId: '111-23',
      projectId: 'p1',
      name: 'Microbiome Donor Version 2',
      remark:
        'Quisque malesuada placerat nisl. Nulla facilisi. Pellentesque auctor neque nec urna. Pellentesque dapibus hendrerit tortor. Donec vitae sapien ut libero venenatis faucibus.',
      project: {
        id: 'p2',
        displayId: '111-24',
        name: 'FFQ',
      },
      questions: [
        {
          id: '1',
          questionVersionId: '1',
          surveyId: '1',
          sort: 1,
        },
        {
          id: '2',
          questionVersionId: '2',
          surveyId: '1',
          sort: 2,
        },
        {
          id: '3',
          questionVersionId: '2',
          surveyId: '1',
          sort: 3,
        },
      ],
      createdBy: mockUser,
      createdAt: new Date(),
    },
  ],
};

export const mockSurveyDetail: ISurvey = {
  id: '1',
  displayId: '111-22',
  projectId: 'p1',
  name: 'Microbiome Donor Programme (AMD)',
  remark:
    'Quisque malesuada placerat nisl. Nulla facilisi. Pellentesque auctor neque nec urna. Pellentesque dapibus hendrerit tortor. Donec vitae sapien ut libero venenatis faucibus.',
  project: {
    id: 'p1',
    displayId: '111-23',
    name: 'FFQ',
  },
  questions: [
    {
      id: '1',
      questionVersionId: '1',
      surveyId: '1',
      sort: 1,
      questionVersion: {
        id: '1.1',
        displayId: '291',
        questionId: '1',
        title: 'What is your name?',
        type: QuestionType.TEXT_ENTRY,
        latestCompletedVersionOfQuestionId: '1',
        status: QuestionVersionStatus.COMPLETED,
        question: {
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
        },
        createdBy: mockUser,
        createdAt: new Date(),
      },
    },
    {
      id: '2',
      questionVersionId: '2',
      surveyId: '1',
      sort: 2,
      questionVersion: {
        id: '1.1',
        displayId: '291',
        questionId: '1',
        title: 'What is your name?',
        type: QuestionType.TEXT_ENTRY,
        latestCompletedVersionOfQuestionId: '1',
        status: QuestionVersionStatus.COMPLETED,
        question: {
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
        },
        createdBy: mockUser,
        createdAt: new Date(),
      },
    },
    {
      id: '3',
      questionVersionId: '2',
      surveyId: '1',
      sort: 3,
      questionVersion: {
        id: '1.1',
        displayId: '291',
        questionId: '1',
        title: 'What is your name?',
        type: QuestionType.TEXT_ENTRY,
        latestCompletedVersionOfQuestionId: '1',
        status: QuestionVersionStatus.COMPLETED,
        question: {
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
        },
        createdBy: mockUser,
        createdAt: new Date(),
      },
    },
  ],
  createdBy: mockUser,
  createdAt: new Date(),
};

interface SurveyQuestionDto {
  questionVersionId: string;
  sort: number;
  remark?: string;
}

interface PostSurveyBodyDto {
  name: string;
  projectId: string;
  remark?: string;
  questions: SurveyQuestionDto[];
}

interface PutSurveyBodyDto {
  name: string;
  remark?: string;
  questions: SurveyQuestionDto[];
}
