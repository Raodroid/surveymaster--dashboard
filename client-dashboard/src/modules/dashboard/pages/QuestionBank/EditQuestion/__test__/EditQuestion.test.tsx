import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import EditQuestion from '../index';
import { QuestionBankService } from '../../../../../../services';
import { notification } from 'antd';
import {
  IQuestion,
  IQuestionVersion,
  QuestionType,
  QuestionVersionStatus,
} from '../../../../../../type';
import clearAllMocks = jest.clearAllMocks;

const mockedUsedNavigate = jest.fn();
const mockLocation = {
  pathname: '/app/question-bank/51/edit',
  search: '?version=24ZU-HURK-PHZD',
};

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockLocation,
  useParams: () => ({
    abc: 'wh',
  }),
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
  masterSubCategoryId: '2',
  masterVariableName: 'yourName',
  latestVersion: questionVersionVersion,
  versions: [questionVersionVersion],
};

const createMock = () => {
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

  Object.defineProperty(window, 'location', {
    value: {
      pathname: '/app/question-bank/51/edit',
      search: '?version=24ZU-HURK-PHZD',
      hash: '',
      host: 'localhost:5000',
      hostname: 'localhost',
      href: 'http://localhost:5000/app/question-bank/51/edit?version=24ZU-HURK-PHZD',
      origin: 'http://localhost:5000',
      port: '5000',
    },
  });

  jest.spyOn(QuestionBankService, 'getQuestionById').mockResolvedValue({
    status: 200,
    statusText: 'success',
    headers: {},
    config: {},
    data: questionMock,
  });
};

test('EditQuestionDetailForm: submit form success', async () => {
  createMock();

  render(
    <JestGeneralProviderHoc>
      <EditQuestion />
    </JestGeneralProviderHoc>,
  );

  await waitFor(() => {
    screen.getByText(/edit question/i);
    screen.getByText(/question details/i);

    screen.getByRole('combobox');
    screen.getByText('What is your name?');
    screen.getByText('yourName');
  });
  screen.logTestingPlaygroundURL();
});
