import { ProjectService, SurveyService } from '../../../../../../../services';
import { ProjectTypes } from '@/type';
import * as router from 'react-router';
import * as hoc from '@hoc/useCheckScopeEntityDefault';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  baseAxiosResponse,
  JestGeneralProviderHoc,
} from '../../../../../../../get-mock-data-jest-test';
import clearAllMocks = jest.clearAllMocks;
import userEvent from '@testing-library/user-event';
import SurveyManagement from '@pages/Survey/SurveyManagement/SurveyManagement';

const mockedUseNavigate = jest.fn();

const createMock = () => {
  const getSurveysAPIRequest = jest
    .spyOn(SurveyService, 'getSurveys')
    .mockResolvedValue({
      ...baseAxiosResponse,
      data: {
        data: [
          {
            createdAt: '2023-03-16T09:58:02.981Z',
            updatedAt: '2023-03-16T09:58:02.981Z',
            deletedAt: null,
            id: '124',
            displayId: 'Z2F7-U8NM-7FU3',
            projectId: '31',
            createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
            updatedBy: null,
            deletedBy: null,
            versions: [
              {
                createdAt: '2023-03-16T09:58:02.981Z',
                updatedAt: '2023-03-17T05:11:31.965Z',
                deletedAt: null,
                id: '147',
                displayId: 'X57N-M726-JKUX',
                surveyId: '124',
                name: 'test survey ',
                numberOfQuestions: 1,
                remark: 'version 01',
                status: 'COMPLETED',
                latestVersionOfSurveyId: null,
                latestCompletedVersionOfSurveyId: '124',
                createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
                updatedBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
                deletedBy: null,
              },
              {
                createdAt: '2023-03-17T05:11:31.965Z',
                updatedAt: '2023-03-17T05:11:31.965Z',
                deletedAt: null,
                id: '148',
                displayId: 'Y2UG-N6DP-5TPX',
                surveyId: '124',
                name: 'test survey ',
                numberOfQuestions: 2,
                remark: 'version 01',
                status: 'DRAFT',
                latestVersionOfSurveyId: '124',
                latestCompletedVersionOfSurveyId: null,
                createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
                updatedBy: null,
                deletedBy: null,
              },
            ],
            latestVersion: {
              createdAt: '2023-03-17T05:11:31.965Z',
              updatedAt: '2023-03-17T05:11:31.965Z',
              deletedAt: null,
              id: '148',
              displayId: 'Y2UG-N6DP-5TPX',
              surveyId: '124',
              name: 'test survey ',
              numberOfQuestions: 2,
              remark: 'version 01',
              status: 'DRAFT',
              latestVersionOfSurveyId: '124',
              latestCompletedVersionOfSurveyId: null,
              createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
              updatedBy: null,
              deletedBy: null,
            },
            latestCompletedVersion: {
              createdAt: '2023-03-16T09:58:02.981Z',
              updatedAt: '2023-03-17T05:11:31.965Z',
              deletedAt: null,
              id: '147',
              displayId: 'X57N-M726-JKUX',
              surveyId: '124',
              name: 'test survey ',
              numberOfQuestions: 1,
              remark: 'version 01',
              status: 'COMPLETED',
              latestVersionOfSurveyId: null,
              latestCompletedVersionOfSurveyId: '124',
              createdBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
              updatedBy: 'b25a602e-1872-4a20-8cd1-b1d9df234733',
              deletedBy: null,
            },
          },
        ],
        hasNextPage: false,
        hasPreviousPage: false,
        itemCount: 1,
        page: 1,
        pageCount: 1,
        take: 10,
      },
    });

  return { getSurveysAPIRequest };
};

beforeEach(() => {
  jest.spyOn(router, 'useLocation').mockReturnValue({
    pathname: '/app/project/31',
    search: '',
    state: undefined,
    key: '',
    hash: '',
  });
  jest.spyOn(ProjectService, 'getProjectById').mockResolvedValue({
    ...baseAxiosResponse,
    data: {
      personResponsible: undefined,
      createdAt: '2023-02-20T02:43:13.766Z',
      updatedAt: '2023-02-20T02:43:13.766Z',
      deletedAt: null,
      id: '31',
      displayId: 'QK22-XJ7F-VV9C',
      name: 'Project 1',
      description: 'project description 001',
      type: ProjectTypes.INTERNAL,
      personInCharge: '63113393-c401-4c23-8c7d-2a7f5cbb1a80',
    },
  });

  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedUseNavigate);

  jest
    .spyOn(router, 'useParams')
    .mockImplementation(() => ({ projectId: '31' }));

  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });
});

afterEach(() => {
  clearAllMocks();
});

test('Survey: base render', async () => {
  const { getSurveysAPIRequest } = createMock();
  render(
    <JestGeneralProviderHoc>
      <SurveyManagement />
    </JestGeneralProviderHoc>,
  );

  screen.getByRole('link', {
    name: /route name/i,
  });
  screen.getByRole('textbox', { name: /showSearch survey/i });
  screen.getByRole('button', { name: /submit showSearch survey button/i });
  screen.getByRole('columnheader', { name: /id/i });
  screen.getByRole('columnheader', { name: /survey title/i });
  screen.getByRole('columnheader', { name: /number of questions/i });
  screen.getByRole('columnheader', { name: /date of creation/i });
  screen.getByRole('columnheader', { name: /action/i });

  screen.getByRole('button', {
    name: /filter button/i,
  });

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
    screen.getByRole('cell', {
      name: /test survey/i,
    });
  });

  screen.getByRole('cell', {
    name: /z2f7\-u8nm\-7fu3/i,
  });
  screen.getByRole('cell', {
    name: /test survey/i,
  });
  screen.getByRole('cell', {
    name: /16\-03\-2023/i,
  });
  screen.getByRole('cell', {
    name: '2',
  });

  screen.getByText(/project 1/i);

  fireEvent.click(
    screen.getByRole('button', {
      name: /left/i,
    }),
  );

  await waitFor(() => {
    expect(getSurveysAPIRequest).toHaveBeenCalled();
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: /right/i,
    }),
  );

  await waitFor(() => {
    expect(getSurveysAPIRequest).toHaveBeenCalled();
  });

  await userEvent.click(screen.getAllByRole('row')[1]);

  expect(mockedUseNavigate).toHaveBeenCalledWith(
    '/app/project/31/124?version=Y2UG-N6DP-5TPX',
  );
});
