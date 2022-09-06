import APIService from './base.service';
import axios, { AxiosResponse } from 'axios';

export default class UploadService {
  static getPreSignedUrlUpload(
    moduleName: string,
    name: string,
    type: string,
  ): Promise<AxiosResponse> {
    return APIService.post(`/${moduleName}/files/get-signed-url`, {
      filename: name,
      filetype: type,
    });
  }

  static putWithFormFileAsync = (url: string, file: any, type: string) => {
    return axios.put(url, file, {
      headers: {
        'Content-Type': `${type}`,
      },
    });
  };
}
