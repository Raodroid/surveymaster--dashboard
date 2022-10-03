import {
  completedVersion,
  draftVersion,
  IQuestionVersion,
  mockCategories,
  mockUser,
  QuestionType,
  QuestionVersionStatus,
} from 'type';
import { UserPayload } from '../redux/user';

export interface IProject {
  id: string;
  name: string;
  displayId: string;
}

export interface ISurveyQuestion {
  id?: string;
  surveyId: string;
  questionVersionId: string;
  sort: number;
  survey?: ISurvey;
  questionVersion?: IQuestionVersion;
}

export interface ISurvey {
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

export interface SurveyQuestionDto {
  questionVersionId: string;
  sort: number;
  remark?: string;
}

export interface PostSurveyBodyDto {
  name: string;
  projectId: string;
  remark?: string;
  questions: SurveyQuestionDto[];
}

export interface PutSurveyBodyDto {
  name: string;
  remark?: string;
  questions: SurveyQuestionDto[];
}

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
