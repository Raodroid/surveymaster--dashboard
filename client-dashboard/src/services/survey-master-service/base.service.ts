import { CognitoService } from 'services';
import axios from 'axios';
import { store } from 'store';
import { AuthSelectors, AuthAction } from 'redux/auth';
import qs from 'qs';

const APIService = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

APIService.interceptors.request.use(
  request => {
    const state = store.getState();
    const token = AuthSelectors.getIdToken(state);

    if (!request.params) {
      request.params = {};
    }
    if (!request.headers) request.headers = {};
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    } else {
      delete request.headers.Authorization;
    }
    request.baseURL = process.env.REACT_APP_BACKEND_API_URL;
    request.paramsSerializer = params => qs.stringify(params);

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
    console.log({ error });
    const originalRequest = error.config;
    const { message, statusCode } = error?.response?.data || {};
    if (statusCode === 401) {
      if (message !== 'Token is expired or invalid') {
        originalRequest.url.includes('logout')
          ? handleLogout()
          : store.dispatch(AuthAction.userSignOut());
        return Promise.reject(error);
      } else {
        let data;
        try {
          data = await CognitoService.refreshToken();
        } catch (err) {
          handleLogout();
          return Promise.reject(err);
        }
        const idToken = data?.AuthenticationResult?.IdToken;
        const accessToken = data?.AuthenticationResult?.AccessToken;
        originalRequest.headers.Authorization = `Bearer ${idToken}`;
        store.dispatch(AuthAction.updateTokens({ idToken, accessToken }));
        return APIService(originalRequest).catch(err => {
          err?.response?.data.statusCode === 401 && handleLogout();
          return Promise.reject(err);
        });
      }
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
