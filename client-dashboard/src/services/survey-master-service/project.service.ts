import { AxiosResponse } from 'axios';
import { ProjectPayload } from 'interfaces';
import { IGetParams } from 'type';
import APIService from './base.service';
import { EntityEnum } from '@/enums';

export default class ProjectService {
  static getProjects(params: IGetParams): Promise<AxiosResponse> {
    return APIService.get(EntityEnum.PROJECT, { params });
  }

  static getProjectById(id: string | undefined): Promise<AxiosResponse> {
    return APIService.get(`${EntityEnum.PROJECT}/${id}`);
  }

  static createProject(payload: ProjectPayload): Promise<AxiosResponse> {
    return APIService.post('projects', payload);
  }

  static updateProject(payload: ProjectPayload): Promise<AxiosResponse> {
    return APIService.put(`${EntityEnum.PROJECT}/${payload.id}`, payload);
  }

  static deleteProject(payload: { projectId: string }): Promise<AxiosResponse> {
    return APIService.delete(`${EntityEnum.PROJECT}/${payload.projectId}`);
  }

  static restoreProject(payload: {
    projectId: string;
  }): Promise<AxiosResponse> {
    return APIService.post(
      `${EntityEnum.PROJECT}/${payload.projectId}/restore`,
    );
  }
}
