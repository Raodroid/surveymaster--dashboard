import { useCheckScopeEntityDefault } from '../../../common/hoc';
import { ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import _get from 'lodash/get';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import ProjectService from '../../../../services/survey-master-service/project.service';
import { IProject } from '../../../../type';
import { onError } from '../../../../utils';

export const useGetAllProjects = () => {
  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECTS);
  const getAllProjectQuery = useQuery(
    ['getAllProjects', canRead],
    canRead
      ? () =>
          ProjectService.getProjects({
            selectAll: true,
            isDeleted: false,
          })
      : () => {},
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

export const useGetProjectByIdQuery = (
  projectId?: string,
): { project: IProject; isLoading: boolean } => {
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
