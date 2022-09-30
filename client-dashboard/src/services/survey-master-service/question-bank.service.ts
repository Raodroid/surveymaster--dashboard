import APIService from './base.service';
import { AxiosResponse } from 'axios';
import {
  BaseQuestionVersionDto,
  GetListQuestionDto,
  IGetParams,
  IQuestion,
  mockCategories,
  mockQuestionList,
  QuestionDetail,
} from '../../type';
import { IAddQuestionFormValue } from '../../modules/dashboard/pages/QuestionBank/AddQuestion';
import { IEditQuestionFormValue } from '../../modules/dashboard/pages/QuestionBank/EditQuestion';

export default class QuestionBankService {
  static getCategories(params: IGetParams): Promise<AxiosResponse> {
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
    // return APIService.get(`/questions/`, { params: props });
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
    // return APIService.get(`/questions/${id}`);

    return Promise.resolve({
      data: QuestionDetail,
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    });
  }
  static deleteQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.delete(`/questions/version/${id}`);
  }
  static restoreQuestionByQuestionId(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.post(`/questions/${id}/restore`);
  }
  static completeQuestion(props): Promise<AxiosResponse> {
    const { id } = props;
    return APIService.patch(`/questions/version/${id}`);
  }
  static updateCompletedQuestion(
    props: BaseQuestionVersionDto,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.post(`/questions/version/${id}`, { data: rest });
  }
  static updateDraftQuestion(
    props: BaseQuestionVersionDto,
  ): Promise<AxiosResponse> {
    const { id, ...rest } = props;
    return APIService.put(`/questions/version/${id}`, { data: rest });
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
