import { render, screen, waitFor } from '@testing-library/react';

import {
  baseAxiosResponse,
  JestGeneralProviderHoc,
} from '../../../../../../get-mock-data-jest-test';
import clearAllMocks = jest.clearAllMocks;
import { ROUTE_PATH } from '../../../../../../enums';
import CategoryDetail from '../index';
import { QuestionBankService } from '../../../../../../services';
import * as hoc from '../../../../../common/hoc/useCheckScopeEntityDefault';
import userEvent from '@testing-library/user-event';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });
  Object.defineProperty(window, 'crypto', {});
  Object.defineProperty(window, 'location', {
    value: {
      href: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ADD_QUESTION,
    },
  });
});

beforeEach(() => {
  clearAllMocks();
});

test('CategoryDetail: render base content', async () => {
  const getCategoryMock = jest
    .spyOn(QuestionBankService, 'getQuestions')
    .mockImplementation(jest.fn())
    .mockResolvedValue({
      ...baseAxiosResponse,
      data: {
        page: 1,
        take: 10,
        itemCount: 4,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          {
            createdAt: '2023-03-03T09:08:52.292Z',
            updatedAt: '2023-03-03T09:08:52.292Z',
            deletedAt: null,
            id: '1',
            displayId: '8BGV-PF4F-JF5N',
            masterCategoryId: '7',
            masterSubCategoryId: '25',
            masterVariableName: 'asdf',
            createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
            updatedBy: null,
            deletedBy: null,
            latestCompletedVersion: null,
            masterCategory: {
              createdAt: '2022-10-04T11:48:13.390Z',
              updatedAt: '2022-10-04T11:48:13.390Z',
              deletedAt: null,
              id: '7',
              name: 'Survey Information',
              parentCategoryId: null,
              createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
              updatedBy: null,
              deletedBy: null,
            },
            masterSubCategory: {
              createdAt: '2022-10-04T11:48:13.390Z',
              updatedAt: '2022-10-04T11:48:13.390Z',
              deletedAt: null,
              id: '25',
              name: 'Qualtrics',
              parentCategoryId: '7',
              createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
              updatedBy: null,
              deletedBy: null,
            },
            latestVersion: {
              createdAt: '2023-03-03T09:08:52.292Z',
              updatedAt: '2023-03-03T09:08:52.292Z',
              deletedAt: null,
              id: '1',
              displayId: 'VQ75-R9J6-B7Y3',
              questionId: '62',
              title: 'this question for test?',
              type: 'DATA_MATRIX',
              dateFormat: null,
              timeFormat: null,
              dataMatrix: {
                rows: ['row'],
                columns: ['name'],
              },
              numberMin: null,
              numberMax: null,
              latestVersionOfQuestionId: '62',
              latestCompletedVersionOfQuestionId: null,
              numberStep: null,
              matrixType: 'RADIO_BUTTON',
              image: null,
              status: 'DRAFT',
              createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
              updatedBy: null,
              deletedBy: null,
              options: [],
            },
          },
        ],
      },
    });
  render(
    <JestGeneralProviderHoc>
      <CategoryDetail />
    </JestGeneralProviderHoc>,
  );

  screen.getByRole('columnheader', { name: /id/i });
  screen.getByRole('columnheader', { name: /question/i });
  screen.getByRole('columnheader', { name: 'Category' });
  screen.getByRole('columnheader', { name: /sub category/i });
  screen.getByRole('columnheader', { name: /variable name/i });
  screen.getByRole('columnheader', { name: /answer type/i });
  screen.getByRole('columnheader', { name: /action/i });

  screen.getByRole('button', {
    name: /left/i,
  });
  screen.getByRole('button', {
    name: /right/i,
  });
  screen.getByRole('combobox', {
    name: /page size/i,
  });

  await waitFor(() => {
    expect(screen.getAllByRole('row').length).toEqual(2);
  });

  await waitFor(() => {
    screen.getByRole('cell', {
      name: /this question for test\?/i,
    });

    screen.getByRole('cell', { name: /survey information/i });
    screen.getByRole('cell', { name: /qualtrics/i });
    screen.getByRole('cell', { name: /asdf/i });
    screen.getByRole('cell', { name: /data matrix/i });
  });

  await userEvent.click(
    screen.getByRole('button', {
      name: /right/i,
    }),
  );

  await waitFor(() => {
    expect(getCategoryMock).toHaveBeenCalled();
  });

  await userEvent.click(
    screen.getByRole('button', {
      name: /right/i,
    }),
  );

  await waitFor(() => {
    expect(getCategoryMock).toHaveBeenCalled();
  });

  await userEvent.click(screen.getAllByRole('row')[1]);

  expect(mockedUsedNavigate).toBeCalledWith(
    '/app/question-bank/1?version=VQ75-R9J6-B7Y3',
  );
});
