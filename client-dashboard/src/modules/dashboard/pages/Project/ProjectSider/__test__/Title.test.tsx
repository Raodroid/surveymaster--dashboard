import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import { IProject, ProjectTypes } from '../../../../../../type';
import Title from '../Title';
import * as hoc from '../../../../../common/hoc/useCheckScopeEntityDefault';
import restoreAllMocks = jest.restoreAllMocks;
import * as router from 'react-router';

const project: IProject = {
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
};
const mockedUseNavigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedUseNavigate);

  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });
});

afterEach(() => {
  restoreAllMocks();
});

test('TitleProjectSider: open toggle project detail', async () => {
  render(
    <JestGeneralProviderHoc>
      <Title
        title={'Project 1'}
        routePath={`/app/project/${project.id}`}
        project={project}
        id={project.id}
      />
    </JestGeneralProviderHoc>,
  );
  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', {
        name: /toggle project detail/i,
      }),
    );
  });

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith('/app/project/31');
  });
});

test('TitleProjectSider: close toggle project detail', async () => {
  jest
    .spyOn(router, 'useParams')
    .mockImplementation(() => ({ projectId: '31' }));

  render(
    <JestGeneralProviderHoc>
      <Title
        title={'Project 1'}
        routePath={`/app/project/${project.id}`}
        project={project}
        id={project.id}
      />
    </JestGeneralProviderHoc>,
  );
  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', {
        name: /toggle project detail/i,
      }),
    );
  });

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith('/app/project');
  });
});

test('TitleProjectSider: click create new survey', async () => {
  jest
    .spyOn(router, 'useParams')
    .mockImplementation(() => ({ projectId: '31' }));

  render(
    <JestGeneralProviderHoc>
      <Title
        title={'Project 1'}
        routePath={`/app/project/${project.id}`}
        project={project}
        id={project.id}
      />
    </JestGeneralProviderHoc>,
  );
  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', {
        name: /create new survey/i,
      }),
    );
  });

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith(
      '/app/project/31/add-survey',
    );
  });
});

test('TitleProjectSider: click view survey list', async () => {
  jest
    .spyOn(router, 'useParams')
    .mockImplementation(() => ({ projectId: '31' }));

  render(
    <JestGeneralProviderHoc>
      <Title
        title={'Project 1'}
        routePath={`/app/project/${project.id}`}
        project={project}
        id={project.id}
      />
    </JestGeneralProviderHoc>,
  );
  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', {
        name: /view survey list/i,
      }),
    );
  });

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith('/app/project/31');
  });
});
