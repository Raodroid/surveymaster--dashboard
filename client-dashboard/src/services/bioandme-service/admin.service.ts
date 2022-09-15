import APIService from './base.service';

export default class AdminService {
  static resetUserPassword(payload: {
    userId: string;
    password: string;
  }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}/setPassword`, payload);
  }

  static inviteMember(payload: {
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    scientificDegree: string;
    authentication: string;
    description?: string;
    roles?: number[] | string[];
  }): Promise<any> {
    return APIService.post(`users`, {
      ...payload,
      description: '',
      roles: [1, 2],
    });
  }

  static editMemberPreferences(payload: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    scientificDegree: string;
    authentication: string;
    description?: string;
    roles?: number[] | string[];
  }): Promise<any> {
    const { id } = payload;
    const params: { tenantId?: any } = {};
    params.tenantId = 'd8faa031-4e95-4d1a-a9c2-7048bac20453';
    return APIService.put(
      `users/${id}`,
      {
        ...payload,
        description: '',
        roles: [4],
        phonePrefix: '',
      },
      { params },
    );
  }

  static removeMemberPreferences(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.delete(`users/${userId}`);
  }

  static deactivateUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}/deactivate`);
  }

  static restoreUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}/restore`);
  }
}
