import APIService from './base.service';
import { AxiosResponse } from 'axios';
import {
  BaseQuestionVersionDto,
  GetListQuestionDto,
  IGetParams,
  IQuestionVersionPutUpdateDto,
  QuestionDetail,
  QuestionVersionStatus,
} from '../../type';
import { IAddQuestionFormValue } from '../../modules/dashboard/pages/QuestionBank/AddQuestion';

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
  static deleteQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/questions/version/${id}`);
  }
  static restoreQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/questions/${id}/restore`);
  }
  static changeStatusQuestion(props: {
    status: QuestionVersionStatus;
    id: string;
  }): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.patch(`/questions/version/${id}`);
  }
  static updateCompletedQuestion(
    props: IQuestionVersionPutUpdateDto & { id: string },
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(`/questions/version/${id}`, rest);
  }
  static updateDraftQuestion(
    props: IQuestionVersionPutUpdateDto & { id: string },
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.patch(`/questions/version/${id}`, rest);
  }
  static addQuestion(props: IAddQuestionFormValue): Promise<AxiosResponse> {
    return APIService.post(`/questions`, { data: props });
  }

  static deleteQuestionByVersionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/questions/version/${id}`);
  }
  static restoreQuestionByVersionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/questions/${id}/restore`);
  }
}
