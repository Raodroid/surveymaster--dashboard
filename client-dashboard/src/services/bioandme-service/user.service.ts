import { UserUpdatedDto } from 'modules/dashboard/pages/Profile/form/UserForm';
import APIService from './base.service';

export default class UserService {
  static getProfile(): Promise<any> {
    return APIService.get('/auth/me');
  }
  static updateProfile(payload: UserUpdatedDto): Promise<any> {
    return APIService.put('/user/me', payload);
  }
}
