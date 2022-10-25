import { NotificationType } from 'aws-sdk/clients/budgets';
import { UserUpdatedDto } from 'interfaces';
import { IGetParams } from 'type';
import APIService from './base.service';

export default class UserService {
  static getProfile(): Promise<any> {
    return APIService.get('/auth/me');
  }

  static updateProfile(payload: UserUpdatedDto): Promise<any> {
    return APIService.put(`/auth/me`, payload);
  }

  static setEmailNoti(payload: {
    id: string;
    isDisableEmailNotification?: boolean;
    disabledNotificationTypes?: NotificationType[];
  }): Promise<any> {
    const { id, disabledNotificationTypes, isDisableEmailNotification } =
      payload;
    return APIService.patch(`users/${id}/email-notification`, {
      disabledNotificationTypes,
      isDisableEmailNotification,
    });
  }

  static getUserById(params: {
    userId: string;
    roles: number[];
  }): Promise<any> {
    return APIService.get(`users/${params.userId}`, { params: params });
  }
}
