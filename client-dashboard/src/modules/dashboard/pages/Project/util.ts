import { ROUTE_PATH } from 'enums';
import _get from 'lodash/get';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import ProjectService from '../../../../services/survey-master-service/project.service';
import { IProject } from '../../../../type';
import { onError } from '../../../../utils';

export const useGetAllProjects = () => {
  const getAllProjectQuery = useQuery(
    ['getAllProjects'],
    () =>
      ProjectService.getProjects({
        selectAll: true,
      }),
    {
      onError,
      refetchOnWindowFocus: false,
    },
  );

  const projects = useMemo<IProject[]>(
    () => _get(getAllProjectQuery.data, 'data.data', []),
    [getAllProjectQuery.data],
  );

  return { projects, isLoading: getAllProjectQuery.isLoading };
};

export const useGetProjectByIdQuery = (projectId?: string) => {
  const getProjectByIdQuery = useQuery(
    ['getProjectById', projectId],
    () => ProjectService.getProjectById(projectId),
    {
      onError,
      enabled: !!projectId,
      refetchOnWindowFocus: false,
    },
  );

  const project = useMemo<IProject>(() => {
    return _get(getProjectByIdQuery.data, 'data', {});
  }, [getProjectByIdQuery.data]);

  return { project, isLoading: getProjectByIdQuery.isLoading };
};

export const projectRoutePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
