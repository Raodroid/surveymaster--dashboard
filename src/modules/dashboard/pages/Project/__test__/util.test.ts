import { ProjectService } from '../../../../../services';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetQuestionByQuestionId } from '../../QuestionBank/util';
import { IProject, ProjectTypes } from '../../../../../type';
import {
  baseAxiosResponse,
  wrapperQuery,
} from '../../../../../get-mock-data-jest-test';
import { useGetAllProjects, useGetProjectByIdQuery } from '../util';
import * as hoc from '../../../../common/hoc/useCheckScopeEntityDefault';

const projectMock: IProject = {
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

afterEach(() => {
  jest.restoreAllMocks();
});

test('useGetQuestionByQuestionId: have fetched permission', async () => {
  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });
  await jest.spyOn(ProjectService, 'getProjects').mockResolvedValue({
    ...baseAxiosResponse,
    data: { data: [projectMock] },
  });
  const { result } = renderHook(() => useGetAllProjects(), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.projects).toEqual([projectMock]);
  });
});

test('useGetQuestionByQuestionId: dont have fetched permission', async () => {
  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: false,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });
  await jest.spyOn(ProjectService, 'getProjects').mockResolvedValue({
    ...baseAxiosResponse,
    data: { data: [projectMock] },
  });
  const { result } = renderHook(() => useGetAllProjects(), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.projects).toEqual([]);
  });
});

test('useGetProjectByIdQuery: do not have project Id', async () => {
  await jest.spyOn(ProjectService, 'getProjectById').mockResolvedValue({
    ...baseAxiosResponse,
    data: projectMock,
  });
  const { result } = renderHook(() => useGetProjectByIdQuery(), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.project).toEqual({});
  });
});

test('useGetProjectByIdQuery: have project Id = 12', async () => {
  await jest.spyOn(ProjectService, 'getProjectById').mockResolvedValue({
    ...baseAxiosResponse,
    data: projectMock,
  });
  const { result } = renderHook(() => useGetProjectByIdQuery('12'), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.project).toEqual(projectMock);
  });
});
