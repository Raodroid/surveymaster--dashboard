import APIService from './base.service';
import { AxiosResponse } from 'axios';
import { mockSurveyDetail, PostSurveyBodyDto } from '../../type';

export default class ProjectService {
  static getSurveyById(props: PostSurveyBodyDto): Promise<AxiosResponse> {
    const { projectId } = props;
    // return APIService.get(`/surveys/${projectId}`);

    return Promise.resolve({
      data: mockSurveyDetail,
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    });
  }

  static createProject(props: PostSurveyBodyDto): Promise<AxiosResponse> {
    return APIService.post(`/surveys`);
  }
}
