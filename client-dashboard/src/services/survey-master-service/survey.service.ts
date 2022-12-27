import { AxiosResponse } from 'axios';
import {
  IGetParams,
  IPostSurveyBodyDto,
  IPostSurveyVersionBodyDto,
  IPutSurveyVersionBodyDtoExtendId,
} from 'type';
import APIService from './base.service';

interface GetSurveyParams extends Omit<IGetParams, 'isDeleted'> {
  projectId?: string;
  isDeleted?: string | boolean;
}

export default class SurveyService {
  static getSurveys(params: GetSurveyParams): Promise<AxiosResponse> {
    return APIService.get('/surveys', { params });
  }
  static getSurveyFile(surveyVersionId: string): Promise<AxiosResponse> {
    return APIService.get(`/surveys/version/${surveyVersionId}/file`);
  }

  static getSurveyById(id: string | undefined): Promise<AxiosResponse> {
    return APIService.get(`/surveys/${id}`);
  }

  static getSurveyHistories(
    params: IGetParams & { surveyId?: string },
  ): Promise<AxiosResponse> {
    const { surveyId } = params;
    return APIService.get(`/surveys/${surveyId}/histories`, { params });
  }

  static getAllSurveyHistories(
    params: IGetParams & { surveyId?: string },
  ): Promise<AxiosResponse> {
    const { surveyId } = params;
    return APIService.get(`/surveys/${surveyId}/histories`, { params });
  }

  static createSurvey(props: IPostSurveyBodyDto): Promise<AxiosResponse> {
    return APIService.post('/surveys', props);
  }
  static createSurveyVersion(
    props: IPostSurveyVersionBodyDto,
  ): Promise<AxiosResponse> {
    return APIService.post('/surveys/version', props);
  }
  static duplicateSurvey(
    props: IPostSurveyBodyDto & { surveyId: string },
  ): Promise<AxiosResponse> {
    const { surveyId } = props;
    return APIService.post(`/surveys/${surveyId}/duplicate`, props);
  }
  static updateSurvey(
    props: IPutSurveyVersionBodyDtoExtendId,
  ): Promise<AxiosResponse> {
    const { surveyVersionId, ...rest } = props;
    return APIService.put(`/surveys/version/${surveyVersionId}`, rest);
  }

  static deleteSurveyVersion(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.delete(`/surveys/version/${id}`);
  }

  static restoreSurveyVersion(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.post(`/survey/version/${id}/restore`);
  }

  //-------------------------

  static deleteSurveyById(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.delete(`/surveys/${id}`);
  }
  static restoreSurveyById(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.post(`/surveys/${id}/restore`);
  }
  static uploadExcelFile(payload: {
    id: string;
    file: string | Blob;
  }): Promise<AxiosResponse> {
    const { id, file } = payload;
    const formData = new FormData();
    formData.append('file', file);
    return APIService.post(
      `/surveys/version/${id}/survey-results/excel`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  }
}
