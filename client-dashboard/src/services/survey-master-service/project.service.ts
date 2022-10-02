import { UpdateProject } from './../../interfaces/project';
import { AxiosResponse } from 'axios';
import { CreateProject } from 'interfaces';
import { IGetParams } from 'type';
import APIService from './base.service';

export default class ProjectService {
  static getProjects(params: IGetParams): Promise<AxiosResponse> {
    return APIService.get('projects', { params });
  }

  static getProjectById(id: string | undefined): Promise<AxiosResponse> {
    return APIService.get(`projects/${id}`);
  }

  static createProject(payload: CreateProject): Promise<AxiosResponse> {
    return APIService.post('projects', payload);
  }

  static updateProject(payload: UpdateProject): Promise<AxiosResponse> {
    return APIService.put(`projects/${payload.id}`, payload);
  }
}
