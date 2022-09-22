import { AxiosResponse } from 'axios';
import APIService from './base.service';

export default class ProfileService {
  static getPublicProfile(email: string): Promise<AxiosResponse> {
    return APIService.get('/profiles/public', {
      params: { email },
    });
  }
}
