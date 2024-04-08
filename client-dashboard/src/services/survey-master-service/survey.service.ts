import { AxiosResponse } from 'axios';
import {
  CreateSurveyBodyDto,
  DuplicateSurveyVersionDto,
  HistoryQueryParam,
  IGetParams,
  IPaginationResponse,
  IPostSurveyVersionBodyDto,
  IPutSurveyVersionBodyDtoExtendId,
  IRequestDeleteRecordDto,
  ISurvey,
  ISurveyRemark,
  ISurveyVersion,
  IUpdateSurveyVersionStatusDto,
  SurveyHistory,
} from '@/type';
import APIService from './base.service';
import { EntityEnum } from '@/enums';

interface GetSurveyParams extends Omit<IGetParams, 'isDeleted'> {
  projectId?: string;
  isDeleted?: string | boolean;
}

export default class SurveyService {
  static getSurveys(params: GetSurveyParams): Promise<AxiosResponse> {
    return APIService.get(`/${EntityEnum.SURVEY}`, { params });
  }
  static getSurveyFile(surveyVersionId: string): Promise<AxiosResponse> {
    return APIService.get(
      `/${EntityEnum.SURVEY}/version/${surveyVersionId}/file`,
    );
  }

  static getSurveyById(
    id: string | undefined,
  ): Promise<AxiosResponse<ISurvey>> {
    return APIService.get(`/${EntityEnum.SURVEY}/${id}`);
  }

  static createSurvey(props: CreateSurveyBodyDto): Promise<AxiosResponse> {
    return APIService.post(EntityEnum.SURVEY, props);
  }

  static createSurveyVersion(
    props: IPostSurveyVersionBodyDto,
  ): Promise<AxiosResponse<ISurveyVersion>> {
    return APIService.post(`/${EntityEnum.SURVEY}/version`, props);
  }

  static duplicateSurvey(
    props: DuplicateSurveyVersionDto,
  ): Promise<AxiosResponse> {
    const { surveyId, ...rest } = props;
    return APIService.post(`/${EntityEnum.SURVEY}/${surveyId}/duplicate`, rest);
  }
  static updateSurveyVersion(
    props: IPutSurveyVersionBodyDtoExtendId,
  ): Promise<AxiosResponse> {
    const { surveyVersionId, ...rest } = props;
    return APIService.put(
      `/${EntityEnum.SURVEY}/version/${surveyVersionId}`,
      rest,
    );
  }
  static updateStatusSurvey(props: {
    surveyVersionId: string;
  }): Promise<AxiosResponse<IPaginationResponse<ISurveyVersion>>> {
    const { surveyVersionId } = props;
    return APIService.put(
      `/${EntityEnum.SURVEY}/version/${surveyVersionId}/completed`,
    );
  }

  static updateStatusSurveyVersion(
    props: IUpdateSurveyVersionStatusDto & {
      surveyVersionId: string;
    },
  ): Promise<AxiosResponse<IPaginationResponse<ISurveyVersion>>> {
    const { surveyVersionId, ...rest } = props;
    return APIService.patch(
      `/${EntityEnum.SURVEY}/version/${surveyVersionId}/status`,
      rest,
    );
  }

  static deleteSurveyVersion(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.delete(`/${EntityEnum.SURVEY}/version/${id}`);
  }

  static restoreSurveyVersion(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.post(`/survey/version/${id}/restore`);
  }

  //-------------------------

  static deleteSurveyById(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.delete(`/${EntityEnum.SURVEY}/${id}`);
  }

  static requestDeleteSurvey(
    payload: IRequestDeleteRecordDto,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = payload;
    return APIService.put(
      `/${EntityEnum.SURVEY}/${id}/survey-deletion-process`,
      rest,
    );
  }

  static requestDeleteSurveyVersion(
    payload: IRequestDeleteRecordDto,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = payload;
    return APIService.put(
      `/${EntityEnum.SURVEY}/version/${id}/survey-deletion-process`,
      rest,
    );
  }

  static restoreSurveyById(payload: { id: string }): Promise<AxiosResponse> {
    const { id } = payload;
    return APIService.post(`/${EntityEnum.SURVEY}/${id}/restore`);
  }

  static getSignedUrl(params: {
    filename: string;
    surveyVersionId: string;
    fileType: string;
  }) {
    return APIService.post(
      `/${EntityEnum.SURVEY}/files/get-signed-url`,
      params,
    );
  }

  // static uploadExcelFile(payload: {
  //   id: string;
  //   file: string | Blob;
  // }): Promise<AxiosResponse> {
  //   const { id, file } = payload;
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return APIService.post(
  //     `/${EntityEnum.SURVEY}/version/${id}/survey-results/excel`,
  //     formData,
  //     {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     },
  //   );
  // }

  static createSurveyRemark(params: {
    surveyVersionId: string;
    remark: string;
  }) {
    return APIService.post(
      `/${EntityEnum.SURVEY}/survey-version-remark`,
      params,
    );
  }
  static getSurveyRemarks(
    params: IGetParams & { surveyVersionId: string },
  ): Promise<AxiosResponse<ISurveyRemark[]>> {
    return APIService.get(`/${EntityEnum.SURVEY}/survey-version-remark`, {
      params,
    });
  }

  static getSurveyChangeLogHistories(
    params: HistoryQueryParam,
  ): Promise<AxiosResponse<SurveyHistory[]>> {
    return APIService.get('/survey-history', {
      params,
    });
  }
}
