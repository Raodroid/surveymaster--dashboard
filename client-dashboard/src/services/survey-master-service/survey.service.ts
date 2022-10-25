import { AxiosResponse } from 'axios';
import { IPostSurveyBodyDto } from 'type';
import APIService from './base.service';

export default class SurveyService {
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

  static updateSurvey(props: IPostSurveyBodyDto): Promise<AxiosResponse> {
    const { surveyId } = props;
    return APIService.put(`/surveys/${surveyId}  `, props);
  }
}
