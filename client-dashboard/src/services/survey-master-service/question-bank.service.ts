import APIService from './base.service';
import { AxiosResponse } from 'axios';
import {
  GetListQuestionDto,
  IQuestion,
  mockCategories,
  mockQuestionList,
} from '../../type';

export default class QuestionBankService {
  static getCategories(params): Promise<AxiosResponse> {
    // return APIService.get('/category', { params });
    return new Promise<AxiosResponse>(resolve => {
      resolve({
        data: mockCategories,
        status: 200,
        statusText: '',
        headers: {},
        config: {},
      });
    });
  }
  static getQuestions(props: GetListQuestionDto): Promise<AxiosResponse> {
    // return APIService.get(`/question/`, { params: props });
    return new Promise<AxiosResponse>(resolve => {
      resolve({
        data: mockQuestionList,
        status: 200,
        statusText: '',
        headers: {},
        config: {},
      });
    });
  }
  static getQuestionById(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.get(`/question/${id}`);
  }
  static deleteQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/question/version/${id}`);
  }
  static restoreQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/question/${id}/restore`);
  }
  static completeQuestion(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.patch(`/question/version/${id}`);
  }
  static updateCompletedQuestion(props: IQuestion): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.post(`/question/version/${id}`, { data: rest });
  }
  static updateDraftQuestion(props: IQuestion): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(`/question/version/${id}`, { data: rest });
  }

  static deleteQuestionByVersionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/question/version/${id}`);
  }
  static restoreQuestionByVersionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/question/${id}/restore`);
  }
}
