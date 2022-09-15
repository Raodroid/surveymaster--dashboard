import { NotificationType } from 'aws-sdk/clients/budgets';
import { UserUpdatedDto } from 'interfaces';
import APIService from './base.service';

export default class UserService {
  static getProfile(): Promise<any> {
    return APIService.get('/auth/me');
  }

  static updateProfile(payload: UserUpdatedDto): Promise<any> {
    const params: { tenantId?: any } = {};
    params.tenantId = 'd8faa031-4e95-4d1a-a9c2-7048bac20453';
    Object.assign(payload, { phonePrefix: '', roles: [4], description: '' });
    return APIService.put(`/users/${payload.id}`, payload);
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
}
