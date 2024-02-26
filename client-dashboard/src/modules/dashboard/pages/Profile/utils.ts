import { PostPutMember } from 'interfaces';
import { useQuery } from 'react-query';
import { RoleService } from '@/services';
import { useMemo } from 'react';
import { Role } from '@/redux/user';
import _get from 'lodash/get';

export const postPutInitialValues: PostPutMember = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  roleIds: [],
  departmentName: '',
  phone: '000000000',
  phonePrefix: '+84',
};

export const useGetAllRoles = () => {
  const getRoleQuery = useQuery(
    ['getAllRoles'],
    () => RoleService.getRoles({ selectAll: true }),
    {
      refetchOnWindowFocus: false,
    },
  );

  return {
    isLoading: getRoleQuery.isLoading,
    data: useMemo<Role[]>(
      () => _get(getRoleQuery.data, 'data', []),
      [getRoleQuery.data],
    ),
  };
};
