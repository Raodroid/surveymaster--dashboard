import { AxiosResponse } from 'axios';
import { IGetParams, IPostSurveyBodyDto } from 'type';
import APIService from './base.service';

interface GetSurveyParams extends Omit<IGetParams, 'isDeleted'> {
  projectId?: string;
  isDeleted?: string | boolean;
}

export default class SurveyService {
  // static getSurveys(
  //   props: IGetParams & { projectId: string },
  // ): Promise<AxiosResponse> {
  //   const { projectId } = props;
  //   return APIService.get(`/surveys/${projectId}`);
  // }

  static getSurveys(params: GetSurveyParams): Promise<AxiosResponse> {
    return APIService.get('surveys', { params });
  }
  static getSurveyFile(surveyId: string): Promise<AxiosResponse> {
    return APIService.get(`surveys/${surveyId}/file`);
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

  static getSurveyHistories(
    params: IGetParams & { surveyId?: string },
  ): Promise<AxiosResponse> {
    const { surveyId } = params;
    return APIService.get(`surveys/${surveyId}/histories`, { params });
  }

  static getAllSurveyHistories(
    params: IGetParams & { surveyId?: string },
  ): Promise<AxiosResponse> {
    const { surveyId } = params;
    return APIService.get(`surveys/${surveyId}/histories`, { params });
  }
}
