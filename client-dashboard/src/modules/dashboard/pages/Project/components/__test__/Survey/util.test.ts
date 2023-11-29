import { renderHook, waitFor } from '@testing-library/react';
import {
  baseAxiosResponse,
  wrapperQuery,
} from '../../../../../../../get-mock-data-jest-test';
import { SurveyService } from '../../../../../../../services';
import * as router from 'react-router';
import restoreAllMocks = jest.restoreAllMocks;
import { surveyMock, surveyVersionMock } from '../survey-mock-data';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';

beforeEach(() => {
  jest.spyOn(router, 'useLocation').mockReturnValue({
    pathname: '/app/survey',
    search: '?version=X57N-M726-JKUX',
    state: undefined,
    key: '',
    hash: '',
  });
  jest.spyOn(SurveyService, 'getSurveyById').mockResolvedValue({
    ...baseAxiosResponse,
    data: surveyMock,
  });
});

afterEach(() => {
  restoreAllMocks();
});

test('useGetSurveyById: have survey Id = undefined', async () => {
  const { result } = renderHook(() => useGetSurveyById(), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.latestVersion).toBeUndefined();
    expect(result.current.currentSurveyVersion).toBeUndefined();
    expect(result.current.surveyData).toEqual({});
  });
});

test('useGetSurveyById: have survey Id', async () => {
  const { result } = renderHook(() => useGetSurveyById('12'), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.latestVersion).toEqual(surveyVersionMock);
    expect(result.current.currentSurveyVersion).toEqual(surveyVersionMock);
    expect(result.current.surveyData).toEqual(surveyMock);
  });
});
