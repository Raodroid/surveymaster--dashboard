import { AxiosResponse } from 'axios';
import { IGetParams } from 'type';
import APIService from './base.service';
import { EntityEnum } from '@/enums';

export default class RoleService {
  static getRoles(params: IGetParams): Promise<AxiosResponse> {
    return APIService.get(EntityEnum.ROLE, { params });
  }
}
