import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from 'axios';
import { CreateProject } from 'interfaces';
import { IGetParams, mockSurveyList } from 'type';
import { UpdateProject } from '../../interfaces';
import { IGetParams, IGetSurvey } from 'type';
import { mockSurveyDetail, PostSurveyBodyDto } from '../../type';
import { UpdateProject } from './../../interfaces/project';
import APIService from './base.service';

export default class ProjectService {
  static getProjects(params: IGetParams): Promise<AxiosResponse> {
    // return APIService.get('projects', { params });

    return Promise.resolve({
      data: mockSurveyList,
      status: 1998,
      statusText: '',
      headers: {},
      config: {},
    });
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

  static getSurveys(params: IGetSurvey): Promise<AxiosResponse> {
    return APIService.get('surveys', { params });
  }
}
