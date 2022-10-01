import { AxiosResponse } from 'axios';
import { CreateProject } from 'interfaces';
import { IGetParams } from 'type';
import APIService from './base.service';

export default class ProjectService {
  static getProjects(params: IGetParams): Promise<AxiosResponse> {
    return APIService.get('projects', { params });
  }

  static createProject(payload: CreateProject): Promise<AxiosResponse> {
    return APIService.post('projects', payload);
  }
}
