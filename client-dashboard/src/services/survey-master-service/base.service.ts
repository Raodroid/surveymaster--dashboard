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

let refreshTokenRequest: any = null;
let isTokenExpired = false;

APIService.interceptors.request.use(
  async request => {
    const state = store.getState();
    const token = AuthSelectors.getIdToken(state);

    if (isTokenExpired) {
      const refreshToken = async () => {
        try {
          return await CognitoService.refreshToken();
        } catch (err) {
          console.log(err);
          handleLogout();
          return null;
        }
      };

      refreshTokenRequest = refreshTokenRequest
        ? refreshTokenRequest
        : refreshToken();

      const newToken = await refreshTokenRequest;
      refreshTokenRequest = null;

      if (newToken) {
        const idToken = newToken?.AuthenticationResult?.IdToken;
        const accessToken = newToken?.AuthenticationResult?.AccessToken;
        store.dispatch(AuthAction.updateTokens({ idToken, accessToken }));
        isTokenExpired = false;
        return request;
      }
      return handleLogout();
    }

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
    isTokenExpired = true;
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
        isTokenExpired = false;
        store.dispatch(AuthAction.updateTokens({ idToken, accessToken }));
        return APIService(originalRequest).catch(err => {
          isTokenExpired = true;
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
