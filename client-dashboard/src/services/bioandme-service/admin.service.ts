import APIService from './base.service';

export default class AdminService {
  static resetUserPassword(payload: {
    userId: string;
    password: string;
  }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}`, payload);
  }

  static inviteMember(payload: {
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    scientificDegree: string;
    authentication: string;
  }): Promise<any> {
    return APIService.post(`users/create`, payload);
  }

  static editMemberPreferences(payload: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    scientificDegree: string;
    authentication: string;
  }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}`, payload);
  }

  static removeMemberPreferences(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.delete(`users/${userId}`);
  }
}
