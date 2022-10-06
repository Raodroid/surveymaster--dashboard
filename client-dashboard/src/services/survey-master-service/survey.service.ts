import { AxiosResponse } from 'axios';
import { CreateProject } from 'interfaces';
import {
  IGetParams,
  IPostSurveyBodyDto,
  IPutSurveyBodyDto,
  IPutSurveyBodyDtoExtendId,
  mockSurveyDetail,
} from 'type';
import { UpdateProject } from '../../interfaces';
import APIService from './base.service';

export default class SurveyService {
  static getSurveyById(
    props: IGetParams & { projectId: string },
  ): Promise<AxiosResponse> {
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
  static createSurvey(props: IPostSurveyBodyDto): Promise<AxiosResponse> {
    return APIService.post('surveys', props);
  }
  static duplicateSurvey(props: IPostSurveyBodyDto): Promise<AxiosResponse> {
    const { surveyId } = props;
    return APIService.post(`/surveys/${surveyId}/duplicate  `, props);
  }
  static updateSurvey(
    props: IPutSurveyBodyDtoExtendId,
  ): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.put(`/surveys/${id}/duplicate  `, props);
  }
}
