import { render, screen, waitFor } from '@testing-library/react';
import {
  baseAxiosResponse,
  JestGeneralProviderHoc,
} from '../../../../../../get-mock-data-jest-test';
import EditQuestion from '../index';
import { QuestionBankService } from '../../../../../../services';
import {
  IQuestion,
  IQuestionVersion,
  QuestionType,
  QuestionVersionStatus,
} from '../../../../../../type';
import userEvent from '@testing-library/user-event';
import clearAllMocks = jest.clearAllMocks;
import { generatePath } from 'react-router';
import { ROUTE_PATH } from '../../../../../../enums';
import { notification } from 'antd';

const mockedUsedNavigate = jest.fn();

const mockLocation = {
  pathname: '/app/question-bank/51/edit',
  search: '?version=24ZU-HURK-PHZD',
};

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockLocation,
}));

jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as any),
  useParams: () => ({ questionId: '51' }),
}));

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
  jest.spyOn(QuestionBankService, 'getQuestionById').mockReturnValueOnce(
    Promise.resolve({
      ...baseAxiosResponse,
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
};

beforeEach(() => {
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

  jest.spyOn(QuestionBankService, 'getCategories').mockReturnValueOnce(
    Promise.resolve({
      ...baseAxiosResponse,
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
});

afterEach(() => {
  clearAllMocks();
});
test('EditQuestionDetailForm: init fetched value', async () => {
  createMock();

  render(
    <JestGeneralProviderHoc>
      <EditQuestion />
    </JestGeneralProviderHoc>,
  );
  screen.getByText(/edit question/i);
  screen.getByText(/question details/i);
  screen.getByText(/answer/i);
  screen.getByRole('button', {
    name: /save new question version/i,
  });

  await waitFor(() => {
    screen.getByText(/text entry/i);
    screen.getByDisplayValue('What is your name?');
    screen.getByDisplayValue('yourName');
    screen.getByText(/survey information/i);
    screen.getByText(/qualtrics/i);
  });
});

test('EditQuestionDetailForm: status = COMPLETED success', async () => {
  createMock();

  const createVersionQuestionAPI = jest
    .spyOn(QuestionBankService, 'createQuestionVersion')
    .mockResolvedValue({
      ...baseAxiosResponse,
      data: { displayId: '1', id: 'abc' },
    });

  render(
    <JestGeneralProviderHoc>
      <EditQuestion />
    </JestGeneralProviderHoc>,
  );
  screen.getByText(/edit question/i);
  screen.getByText(/question details/i);
  screen.getByText(/answer/i);
  screen.getByRole('button', {
    name: /save new question version/i,
  });

  await waitFor(() => {
    screen.getByText(/text entry/i);
  });

  await userEvent.type(
    screen.getByRole('textbox', {
      name: 'title',
    }),
    ' and your middle name?',
  );

  await userEvent.click(
    screen.getByRole('button', {
      name: /save new question version/i,
    }),
  );

  await waitFor(() => {
    expect(createVersionQuestionAPI).toHaveBeenCalledWith({
      version: {
        type: 'TEXT_ENTRY',
        image: '',
        title: 'What is your name? and your middle name?',
        status: 'DRAFT',
      },
      questionId: '51',
    });
  });

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      generatePath(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION, {
        questionId: '51',
      }) + '?version=1',
    );
  });
});

test('EditQuestionDetailForm: status = DRAFT failed', async () => {
  createMock(QuestionVersionStatus.DRAFT);
  const notiErrorMock = jest.spyOn(notification, 'error');

  const updateVersionQuestionAPI = jest
    .spyOn(QuestionBankService, 'updateDraftQuestion')
    .mockRejectedValue('error');

  render(
    <JestGeneralProviderHoc>
      <EditQuestion />
    </JestGeneralProviderHoc>,
  );
  screen.getByText(/edit question/i);
  screen.getByText(/question details/i);
  screen.getByText(/answer/i);
  screen.getByRole('button', {
    name: /save new question version/i,
  });

  await waitFor(() => {
    screen.getByText(/text entry/i);
  });

  await userEvent.type(
    screen.getByRole('textbox', {
      name: 'title',
    }),
    ' and your middle name?',
  );

  await userEvent.click(
    screen.getByRole('button', {
      name: /save new question version/i,
    }),
  );

  await waitFor(() => {
    expect(updateVersionQuestionAPI).toHaveBeenCalledWith({
      id: '69',
      version: {
        image: '',
        type: 'TEXT_ENTRY',
        title: 'What is your name? and your middle name?',
      },
    });
  });
  await waitFor(() => {
    expect(notiErrorMock).toHaveBeenCalledTimes(1);
  });
});
