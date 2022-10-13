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
    },
  );

  const projects = useMemo<IProject[]>(
    () => _get(getAllProjectQuery.data, 'data.data', []),
    [getAllProjectQuery.data],
  );

  return { projects, isLoading: getAllProjectQuery.isLoading };
};

export const getProjectTitle = (search: string) =>
  search.replace('?projectName=', '').replace(/%20/g, ' ');

export const projectRoutePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;
