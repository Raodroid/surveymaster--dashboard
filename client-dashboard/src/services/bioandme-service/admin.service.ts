import APIService from './base.service';

export default class AdminService {
  static resetUserPassword(payload: { userId: string }): Promise<any> {
    const { userId } = payload;
    return APIService.put(`users/${userId}/reset-password`);
  }
}
