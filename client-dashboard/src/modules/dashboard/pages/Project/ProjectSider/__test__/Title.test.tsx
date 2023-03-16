import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import { IProject, ProjectTypes } from '../../../../../../type';
import Title from '../Title';
import * as hoc from '../../../../../common/hoc/useCheckScopeEntityDefault';
import restoreAllMocks = jest.restoreAllMocks;

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

beforeEach(() => {
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

test('TitleProjectSider: base render', async () => {
  const mockedUsedNavigate = jest.fn();

  jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useParams: () => ({ questionId: '31' }),
    useNavigate: () => mockedUsedNavigate,
  }));
  render(
    <JestGeneralProviderHoc>
      <Title
        title={'Project 1'}
        routePath={`/app/project/${project.id}`}
        project={project}
      />
    </JestGeneralProviderHoc>,
  );
  screen.getByRole('button', {
    name: /toggle project detail/i,
  });

  screen.getByRole('button', {
    name: /view survey list/i,
    hidden: true,
  });
  screen.getByRole('button', {
    name: /create new survey/i,
    hidden: true,
  });

  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', {
        name: /toggle project detail/i,
      }),
    );
  });

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/app/project/31');
  });
});
