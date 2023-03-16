import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  baseAxiosResponse,
  JestGeneralProviderHoc,
} from '../../../../../../get-mock-data-jest-test';
import { IProject, ProjectTypes } from '../../../../../../type';
import * as hoc from '../../../../../common/hoc/useCheckScopeEntityDefault';
import restoreAllMocks = jest.restoreAllMocks;
import * as router from 'react-router';
import ProjectSider from '../index';
import ProjectService from '../../../../../../services/survey-master-service/project.service';

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

  jest.spyOn(ProjectService, 'getProjects').mockResolvedValue({
    ...baseAxiosResponse,
    data: { data: [project] },
  });
});

afterEach(() => {
  restoreAllMocks();
});

test('TitleProjectSider: click add new project', async () => {
  render(
    <JestGeneralProviderHoc>
      <ProjectSider />
    </JestGeneralProviderHoc>,
  );

  fireEvent.click(screen.getByText(/add new project/i));

  expect(mockedUseNavigate).toHaveBeenCalledWith('/app/project/add-project', {
    replace: false,
    state: undefined,
  });

  screen.logTestingPlaygroundURL();
});
