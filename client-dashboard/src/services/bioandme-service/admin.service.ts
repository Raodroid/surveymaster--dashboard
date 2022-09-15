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
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    scientificDegree: string;
    authentication: string;
    description?: string;
    roles?: number[] | string[];
  }): Promise<any> {
    const { userId } = payload;
    return APIService.put(`users/${userId}`, {
      ...payload,
      description: '',
      roles: [1, 2],
    });
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
