import { PostPutMember } from 'interfaces';
import { IGetParams } from 'type';
import APIService from './base.service';
import { EntityEnum } from '@/enums';

export default class AdminService {
  static getTeamMembers(params: IGetParams): Promise<any> {
    return APIService.get(EntityEnum.USER, { params: params });
  }

  static resetUserPassword(payload: {
    userId: string;
    password: string;
  }): Promise<any> {
    const { userId } = payload;
    return APIService.patch(`${EntityEnum.USER}/${userId}/password`, payload);
  }

  static inviteMember(payload: PostPutMember): Promise<any> {
    return APIService.post(`${EntityEnum.USER}`, payload);
  }

  static updateMember(payload: PostPutMember): Promise<any> {
    return APIService.put(`/${EntityEnum.USER}/${payload.id}`, payload);
  }

  static deactivateUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.delete(`${EntityEnum.USER}/${userId}`);
  }

  static restoreUser(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.post(`${EntityEnum.USER}/${userId}/restore`);
  }
}
