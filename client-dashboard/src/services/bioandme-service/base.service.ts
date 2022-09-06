import axios, { AxiosRequestHeaders } from 'axios';
import { store } from 'store';
import { AuthSelectors, AuthAction } from 'redux/auth';
import qs from 'qs';

const APIService = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const regexUsedForCheckPathNeedToAttachCognitoInfo = [
  /^(\/)?users/,
  /^(\/)?auth/,
  /^(\/)?tenant-address/,
  /^(\/)?user-address/,
  /^(\/)?orders/,
  /^(\/)?profiles/,
  /^(\/)?internal-surveys/,
];

APIService.interceptors.request.use(
  request => {
    const state = store.getState();
    const token = AuthSelectors.getIdToken(state);

    if (!request.params) {
      request.params = {};
    }
    if (!request.headers) request.headers = {};
    if (request.url?.includes('countrystatecity')) {
      (request.headers as AxiosRequestHeaders)['X-CSCAPI-KEY'] = process.env
        .REACT_APP_X_CSCAPI_KEY as string;
      request.headers.Authorization = delete request.headers.Authorization;
    } else if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    } else {
      delete request.headers.Authorization;
    }
    request.baseURL = process.env.REACT_APP_BACKEND_API_URL;
    request.paramsSerializer = params => qs.stringify(params);
    if (
      regexUsedForCheckPathNeedToAttachCognitoInfo.some(regex =>
        regex.test(request.url || ''),
      )
    )
      return request;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls
APIService.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const { message, statusCode } = error?.response?.data || {};
    if (statusCode === 401) {
      originalRequest.url.includes('logout')
        ? handleLogout()
        : store.dispatch(AuthAction.userSignOut());
      return Promise.reject(error);
    } else {
      originalRequest.url.includes('logout') && handleLogout();
      return Promise.reject(error);
    }
  },
);

export const clearAxiosToken = () => {
  delete APIService.defaults.headers['Authorization'];
};

const handleLogout = () => {
  store.dispatch(AuthAction.userSignOutSuccess());
  clearAxiosToken();
};

export default APIService;
