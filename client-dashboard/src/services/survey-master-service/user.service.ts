import { NotificationType } from 'aws-sdk/clients/budgets';
import { UserUpdatedDto } from 'interfaces';
import APIService from './base.service';
import { AxiosResponse } from 'axios';
import { EntityEnum } from '@/enums';

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
    return APIService.patch(`${EntityEnum.USER}/${id}/email-notification`, {
      disabledNotificationTypes,
      isDisableEmailNotification,
    });
  }

  static getUserById(params: {
    userId: string;
    roles: number[];
  }): Promise<any> {
    return APIService.get(`${EntityEnum.USER}/${params.userId}`, {
      params: params,
    });
  }

  static deactivateProfile(): Promise<AxiosResponse> {
    return APIService.delete('/auth/me/deactivate');
  }
}
