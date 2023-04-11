import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { notification } from 'antd';
import * as router from 'react-router';
import {
  JestGeneralProviderHoc,
  baseAxiosResponse,
} from '../../../../../../../../get-mock-data-jest-test';
import { AuthSelectors } from '../../../../../../../../redux/auth';
import { AdminService, ProjectService } from '../../../../../../../../services';
import * as hoc from '../../../../../../../common/hoc/useCheckScopeEntityDefault';
import { AddProject } from '../../Project';
import clearAllMocks = jest.clearAllMocks;

const mockedUseNavigate = jest.fn();

jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as any),
  useSelector: fn => fn(),
}));

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedUseNavigate);
  jest.spyOn(AuthSelectors, 'getAllRoles').mockImplementation(() => ({
    roles: [
      {
        id: 1,
        name: 'admin',
      },
      {
        id: 2,
        name: 'staff',
      },
    ],
  }));

  jest.spyOn(AdminService, 'getTeamMembers').mockResolvedValue({
    ...baseAxiosResponse,
    data: {
      page: 1,
      take: 30,
      itemCount: 11,
      pageCount: 1,
      hasPreviousPage: false,
      hasNextPage: false,
      data: [
        {
          createdAt: '2023-03-03T02:48:05.682Z',
          updatedAt: '2023-03-03T02:48:05.682Z',
          deletedAt: null,
          id: 'c45ef93e-8271-4b96-bde3-b33117b7f30a',
          email: 'mya@gmail.com',
          emailVerified: false,
          firstName: 'mya',
          lastName: '',
          phonePrefix: null,
          phone: null,
          smsVerified: false,
          phoneVerified: false,
          description: null,
          activated: true,
          avatar: null,
          isDisableEmailNotification: false,
          displayName: null,
          departmentName: null,
          userRoles: [
            {
              createdAt: '2023-03-03T02:48:05.705Z',
              updatedAt: '2023-03-03T02:48:05.705Z',
              deletedAt: null,
              userId: 'c45ef93e-8271-4b96-bde3-b33117b7f30a',
              roleId: 2,
            },
          ],
        },
        {
          createdAt: '2023-03-03T02:45:58.699Z',
          updatedAt: '2023-03-03T02:45:58.699Z',
          deletedAt: null,
          id: '671bbdda-d4ca-4c9a-a1df-9c450712b55c',
          email: 'mia@gmail.com',
          emailVerified: false,
          firstName: 'mia',
          lastName: '',
          phonePrefix: null,
          phone: null,
          smsVerified: false,
          phoneVerified: false,
          description: null,
          activated: true,
          avatar: null,
          isDisableEmailNotification: false,
          displayName: null,
          departmentName: null,
          userRoles: [
            {
              createdAt: '2023-03-03T02:45:58.729Z',
              updatedAt: '2023-03-03T02:45:58.729Z',
              deletedAt: null,
              userId: '671bbdda-d4ca-4c9a-a1df-9c450712b55c',
              roleId: 2,
            },
          ],
        },
      ],
    },
  });
});

afterEach(() => {
  clearAllMocks();
});

test('AddProject', async () => {
  const notificationMock = jest.spyOn(notification, 'success');
  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });

  const createProjectAPI = jest
    .spyOn(ProjectService, 'createProject')
    .mockResolvedValue(baseAxiosResponse);
  render(
    <JestGeneralProviderHoc>
      <AddProject />
    </JestGeneralProviderHoc>,
  );

  await waitFor(() => {
    screen.getByText(/add new project/i);
    screen.getByText(/main information:/i);
    screen.getByText(/project title/i);
  });

  await act(async () => {
    await userEvent.type(
      screen.getByRole('textbox', {
        name: /name/i,
      }),
      'project name',
    );
  });
  await act(async () => {
    await userEvent.click(
      screen.getByRole('combobox', {
        name: /type/i,
      }),
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('External'));
  });

  await waitFor(() => {
    screen.getByText(/project description/i);
  });

  await act(async () => {
    await userEvent.type(
      screen.getByRole('textbox', {
        name: /description/i,
      }),
      'this is a description',
    );
  });

  await waitFor(() => {
    screen.getByText(/person in charge/i);
  });

  await act(async () => {
    await userEvent.click(
      screen.getByRole('combobox', {
        name: /personincharge/i,
      }),
    );
  });
  await waitFor(() => {
    screen.getByRole('option', {
      name: /mya/i,
    });
    screen.getByRole('option', {
      name: /mia/i,
    });
  });

  await act(async () => {
    fireEvent.click(screen.getByText(/mya/i));
  });

  await act(async () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /save project/i,
      }),
    );
  });
  await waitFor(() => {
    expect(createProjectAPI).toHaveBeenCalledWith({
      description: 'this is a description',
      id: '',
      name: 'project name',
      personInCharge: 'c45ef93e-8271-4b96-bde3-b33117b7f30a',
      type: 'EXTERNAL',
    });
  });

  await waitFor(() => {
    expect(notificationMock).toHaveBeenCalledWith({
      message: 'Create successfully',
    });
  });

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith('/app/project');
  });
});
