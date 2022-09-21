import { GetTeamMembers, InviteMember, UpdateMember } from 'interfaces';
import APIService from './base.service';

export default class AdminService {
  static getTeamMembers(params: GetTeamMembers): Promise<any> {
    return APIService.get(`users`, { params: params });
  }

  static resetUserPassword(payload: {
    userId: string;
    password: string;
  }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}/password`, payload);
  }

  static inviteMember(payload: InviteMember): Promise<any> {
    console.log({
      ...payload,
      description: '',
      phonePrefix: '',
      phone: '',
      roles: [3],
    });

    return APIService.post(`users`, {
      ...payload,
      description: '',
      phonePrefix: '',
      phone: '',
      roles: [3],
    });
  }

  static updateMember(payload: UpdateMember): Promise<any> {
    return APIService.put(`/users/${payload.id}`, payload);
  }

  static removeMemberPreferences(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.delete(`users/${userId}`);
  }

  static deactivateUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.delete(`users/${userId}`);
  }

  static restoreUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}/restore`);
  }
}
