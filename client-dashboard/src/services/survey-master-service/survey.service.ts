import { AxiosResponse } from 'axios';
import { UpdateSurvey } from 'interfaces';
import {  GetListSurveyDto, IPostSurveyBodyDto } from 'type';
import APIService from './base.service';

export default class SurveyService {
  // static getSurveys(
  //   props: IGetParams & { projectId: string },
  // ): Promise<AxiosResponse> {
  //   const { projectId } = props;
  //   return APIService.get(`/surveys/${projectId}`);
  // }

  static getSurveys(params: any): Promise<AxiosResponse> {
    return APIService.get('surveys', { params });
  }

  static getSurveyById(id: string | undefined): Promise<AxiosResponse> {
    return APIService.get(`surveys/${id}`);
  }

  static createSurvey(props: IPostSurveyBodyDto): Promise<AxiosResponse> {
    return APIService.post('surveys', props);
  }
  static duplicateSurvey(props: IPostSurveyBodyDto): Promise<AxiosResponse> {
    const { surveyId } = props;
    return APIService.post(`/surveys/${surveyId}/duplicate  `, props);
  }

  static updateSurvey(props: UpdateSurvey): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.put(`/surveys/${id}  `, props);
  }
}
