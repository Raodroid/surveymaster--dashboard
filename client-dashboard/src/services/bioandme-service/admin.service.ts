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
    const params: { tenantId?: any } = {};
    params.tenantId = 'd8faa031-4e95-4d1a-a9c2-7048bac20453';
    return APIService.post(
      `users`,
      {
        ...payload,
        description: '',
        roles: [4],
      },
      { params },
    );
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
    const params: { tenantId?: any } = {};
    params.tenantId = 'd8faa031-4e95-4d1a-a9c2-7048bac20453';
    Object.assign(payload, {
      phone: '',
      phonePrefix: '',
      roles: [4],
      description: '',
    });
    return APIService.put(`/users/${payload.id}`, payload);
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
