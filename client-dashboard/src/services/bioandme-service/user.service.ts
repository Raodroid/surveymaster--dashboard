import APIService from './base.service';

export default class UserService {
  static getProfile(): Promise<any> {
    return APIService.get('/auth/me');
  }
}
