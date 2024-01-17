import APIService from './base.service';
import { AxiosResponse } from 'axios';
import {
  GetListQuestionDto,
  IGetParams,
  IQuestionCreatePostDto,
  IQuestionVersionPatchUpdateDtoExtendId,
  IQuestionVersionPostNewDto,
  IQuestionVersionPutUpdateDtoExtendId,
  IRequestDeleteRecordDto,
  QuestionVersionStatus,
} from '@/type';
import { EntityEnum } from '@/enums';

export default class QuestionBankService {
  static getCategories(params: IGetParams): Promise<AxiosResponse> {
    return APIService.get(EntityEnum.CATEGORY, { params });
  }
  static getQuestions(params: GetListQuestionDto): Promise<AxiosResponse> {
    const { body, ...rest } = params;
    return APIService.post(`/${EntityEnum.QUESTION}/query`, body, {
      params: rest,
    });
  }
  static getQuestionById(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.get(`/${EntityEnum.QUESTION}/${id}`);
  }
  static deleteQuestion(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/${EntityEnum.QUESTION}/${id}`);
  }
  static duplicateQuestion(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/${EntityEnum.QUESTION}/${id}/duplicate`);
  }

  static restoreQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/${EntityEnum.QUESTION}/${id}/restore`);
  }

  static changeStatusQuestion(
    props: IQuestionVersionPatchUpdateDtoExtendId,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.patch(`/${EntityEnum.QUESTION}/version/${id}`, rest);
  }

  static changeStatusQuestionVersion(props: {
    id: string;
    approvalUserId: string;
    status: QuestionVersionStatus;
  }): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(`/${EntityEnum.QUESTION}/version/${id}/status`, rest);
  }

  static requestDeleteQuestionVersion(
    props: IRequestDeleteRecordDto,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(
      `/${EntityEnum.QUESTION}/version/${id}/question-deletion-process`,
      rest,
    );
  }

  static requestDeleteQuestion(
    props: IRequestDeleteRecordDto,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(
      `/${EntityEnum.QUESTION}/${id}/question-deletion-process`,
      rest,
    );
  }

  static createQuestionVersion(
    props: IQuestionVersionPostNewDto,
  ): Promise<AxiosResponse> {
    return APIService.post(`/${EntityEnum.QUESTION}/version/`, props);
  }

  static updateDraftQuestion(
    props: IQuestionVersionPutUpdateDtoExtendId,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(`/${EntityEnum.QUESTION}/version/${id}`, rest);
  }
  static addQuestion(props: IQuestionCreatePostDto): Promise<AxiosResponse> {
    return APIService.post(`/${EntityEnum.QUESTION}`, props);
  }

  static deleteQuestionVersion(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/${EntityEnum.QUESTION}/version/${id}`);
  }
  static restoreQuestionByVersionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/${EntityEnum.QUESTION}/${id}/restore`);
  }
}
