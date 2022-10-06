import { useQuery } from 'react-query';
import { useMemo } from 'react';
import { IProject } from '../../../../type';
import _get from 'lodash/get';
import { onError } from '../../../../utils';
import ProjectService from '../../../../services/survey-master-service/project.service';

export const useGetAllProjects = () => {
  const getAllProjectQuery = useQuery(
    ['getAllProjects'],
    () =>
      ProjectService.getProjects({
        selectAll: true,
      }),
    {
      onError,
    },
  );

  const projects = useMemo<IProject[]>(
    () => _get(getAllProjectQuery.data, 'data.data', []),
    [getAllProjectQuery.data],
  );

  return { projects, isLoading: getAllProjectQuery.isLoading };
};
