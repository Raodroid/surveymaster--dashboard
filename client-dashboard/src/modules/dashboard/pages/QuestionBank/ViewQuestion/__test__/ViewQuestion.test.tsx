import { render, screen, waitFor } from '@testing-library/react';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import ViewQuestion from '../index';
import { QuestionBankService } from '../../../../../../services';
import {
  IQuestion,
  IQuestionVersion,
  QuestionType,
  QuestionVersionStatus,
} from '../../../../../../type';
import userEvent from '@testing-library/user-event';
import * as hoc from '../../../../../common/hoc/useCheckScopeEntityDefault';
import clearAllMocks = jest.clearAllMocks;

const mockedUsedNavigate = jest.fn();
const mockLocation = {
  pathname: '/app/question-bank/51',
  search: '?version=24ZU-HURK-PHZD',
};

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockLocation,
  useMatch: () => true,
}));

jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as any),
  useParams: () => ({ questionId: '51' }),
}));

beforeEach(() => {
  clearAllMocks();
});

const questionVersionVersion: IQuestionVersion = {
  createdAt: '2023-02-28T03:01:16.042Z',
  updatedAt: '2023-02-28T03:01:16.042Z',
  deletedAt: null,
  id: '69',
  displayId: '24ZU-HURK-PHZD',
  questionId: '51',
  title: 'What is your name?',
  type: QuestionType.TEXT_ENTRY,
  latestVersionOfQuestionId: '51',
  status: QuestionVersionStatus.DRAFT,
  options: [],
  createdBy: {
    firstName: 'hannah',
    lastName: 'lee',
  },
};

const questionMock: IQuestion = {
  createdBy: questionVersionVersion.createdBy,
  latestCompletedVersion: questionVersionVersion,
  masterCombineTokenString: '',
  createdAt: '2023-02-28T03:01:16.042Z',
  updatedAt: '2023-02-28T03:01:16.042Z',
  deletedAt: null,
  id: '51',
  displayId: 'SHEY-PSMB-CMT9',
  masterCategoryId: '1',
  masterSubCategoryId: '1.1',
  masterVariableName: 'yourName',
  latestVersion: questionVersionVersion,
  versions: [questionVersionVersion],
};

const createMock = (status = QuestionVersionStatus.COMPLETED) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(window, 'crypto', {});

  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });

  jest.spyOn(QuestionBankService, 'getQuestionById').mockReturnValueOnce(
    Promise.resolve({
      status: 200,
      statusText: 'success',
      headers: {},
      config: {},
      data: {
        ...questionMock,
        latestCompletedVersion: {
          ...questionMock.latestCompletedVersion,
          status,
        },
        latestVersion: { ...questionMock.latestVersion, status },
        versions: [{ ...questionMock.versions[0], status }],
      },
    }),
  );
  jest.spyOn(QuestionBankService, 'getCategories').mockReturnValueOnce(
    Promise.resolve({
      status: 200,
      statusText: 'success',
      headers: {},
      config: {},
      data: {
        data: [
          {
            id: '1',
            name: 'Survey Information',
            children: [
              {
                name: 'Qualtrics',
                id: '1.1',
              },
              {
                name: 'Generals',
                id: '1.2',
              },
            ],
          },
          {
            id: '2',
            name: 'GPAQ',
            children: [
              {
                name: 'Hannah',
                id: '2.1',
              },
            ],
          },
        ],
      },
    }),
  );
};

test('ViewQuestionDetailForm: base render', async () => {
  createMock();

  render(
    <JestGeneralProviderHoc>
      <ViewQuestion />
    </JestGeneralProviderHoc>,
  );
  screen.getByText(/view question/i);
  screen.getByRole('button', { name: /delete this version/i });
  screen.getByRole('button', { name: 'direct-edit-page' });

  await waitFor(() => {
    screen.getByText(/version 24zu\-hurk\-phzd/i);
    screen.getByText(/text entry/i);
    screen.getByDisplayValue('What is your name?');
    screen.getByDisplayValue('yourName');
    screen.getByText(/survey information/i);
    screen.getByText(/qualtrics/i);
  });

  screen.getByText(/question details/i);
  screen.getByText(/question id/i);
  screen.getByText(/master question category/i);
  screen.getByText(/master question sub category/i);
  screen.getByText(/master variable name/i);
  screen.getByText(/master combined token/i);
  screen.getByText(/version id/i);

  await waitFor(() => {
    screen.getByRole('textbox', { name: /createdat/i });

    screen.getByRole('textbox', { name: /displayId/i });
    screen.getByRole('textbox', { name: /masterCombineToken/i });

    screen.getByDisplayValue('28-02-2023');
  });

  screen.logTestingPlaygroundURL();

  await userEvent.click(
    screen.getByRole('button', { name: 'direct-edit-page' }),
  );
  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/app/question-bank/51/edit?version=24ZU-HURK-PHZD',
    );
  });
});

test('ViewQuestionDetailForm: status = DRAFT mark as complete', async () => {
  createMock(QuestionVersionStatus.DRAFT);

  const markAsCompleteQuestionAPI = jest
    .spyOn(QuestionBankService, 'changeStatusQuestion')
    .mockResolvedValue({
      data: {},
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    });

  render(
    <JestGeneralProviderHoc>
      <ViewQuestion />
    </JestGeneralProviderHoc>,
  );

  await waitFor(() => {
    screen.getByText(/mark as completed/i);
  });

  await userEvent.click(screen.getByText(/mark as completed/i));

  await waitFor(() => {
    expect(markAsCompleteQuestionAPI).toHaveBeenCalledWith({
      id: '69',
      version: { status: 'COMPLETED' },
    });
  });
});

test('ViewQuestionDetailForm: delete version', async () => {
  createMock(QuestionVersionStatus.DRAFT);

  const deleteVersionQuestionAPI = jest
    .spyOn(QuestionBankService, 'deleteQuestionVersion')
    .mockResolvedValue({
      data: {},
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    });

  render(
    <JestGeneralProviderHoc>
      <ViewQuestion />
    </JestGeneralProviderHoc>,
  );

  await userEvent.click(screen.getByText(/delete this version/i));

  await waitFor(() => {
    expect(deleteVersionQuestionAPI).toHaveBeenCalledWith({ id: '69' });
  });
});
