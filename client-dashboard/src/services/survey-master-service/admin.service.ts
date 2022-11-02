import { PostPutMember } from 'interfaces';
import { IGetParams } from 'type';
import APIService from './base.service';

export default class AdminService {
  static getTeamMembers(params: IGetParams): Promise<any> {
    return APIService.get(`users`, { params: params });
  }

  static resetUserPassword(payload: {
    userId: string;
    password: string;
  }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`users/${userId}/password`, payload);
  }

  static inviteMember(payload: PostPutMember): Promise<any> {
    return APIService.post(`users`, payload);
  }

  static updateMember(payload: PostPutMember): Promise<any> {
    return APIService.put(`/users/${payload.id}`, payload);
  }

  static deactivateUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.delete(`users/${userId}`);
  }

  static restoreUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.post(`users/${userId}/restore`);
  }
}
