import APIService from './base.service';
import { AxiosResponse } from 'axios';
import {
  GetListQuestionDto,
  IGetParams,
  IQuestionCreatePostDto,
  IQuestionVersionPatchUpdateDtoExtendId,
  IQuestionVersionPostNewDto,
} from '../../type';

export default class QuestionBankService {
  static getCategories(params: IGetParams): Promise<AxiosResponse> {
    return APIService.get('/categories', { params });
  }
  static getQuestions(params: GetListQuestionDto): Promise<AxiosResponse> {
    return APIService.get(`/questions`, { params });
  }
  static getQuestionById(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.get(`/questions/${id}`);
  }
  static deleteQuestion(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/questions/${id}`);
  }
  static restoreQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/questions/${id}/restore`);
  }
  static changeStatusQuestion(
    props: IQuestionVersionPatchUpdateDtoExtendId,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.patch(`/questions/version/${id}`, rest);
  }
  static createQuestionVersion(
    props: IQuestionVersionPostNewDto,
  ): Promise<AxiosResponse> {
    return APIService.post(`/questions/version/`, props);
  }
  static updateDraftQuestion(
    props: IQuestionVersionPatchUpdateDtoExtendId,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(`/questions/version/${id}`, rest);
  }
  static addQuestion(props: IQuestionCreatePostDto): Promise<AxiosResponse> {
    return APIService.post(`/questions`, props);
  }

  static deleteQuestionVersion(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/questions/version/${id}`);
  }
  static restoreQuestionByVersionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/questions/${id}/restore`);
  }
}
