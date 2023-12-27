import { useCheckScopeEntityDefault } from '@/modules/common/hoc';
import { SCOPE_CONFIG } from 'enums';
import _get from 'lodash/get';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { ProjectService } from 'services';
import { IProject } from 'type';
import { onError } from 'utils';

export const useGetAllProjects = () => {
  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECT);
  const getAllProjectQuery = useQuery(
    ['getAllProjects', canRead],
    () =>
      ProjectService.getProjects({
        selectAll: true,
        isDeleted: false,
      }),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: canRead,
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
