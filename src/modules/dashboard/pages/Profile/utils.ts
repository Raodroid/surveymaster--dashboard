import { PostPutMember } from 'interfaces';
import { useQuery } from 'react-query';
import { RoleService } from '@/services';
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
  const { isLoading, data } = useQuery(
    ['getAllRoles'],
    () => RoleService.getRoles({ selectAll: true }),
    {
      refetchOnWindowFocus: false,
    },
  );

  return {
    isLoading,
    data: _get(data, 'data', []),
  };
};
