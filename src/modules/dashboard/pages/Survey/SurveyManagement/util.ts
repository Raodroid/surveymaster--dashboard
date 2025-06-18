import { useQuery } from 'react-query';
import { SurveyService } from '@/services';
import { onError } from '@/utils';
import { useMemo } from 'react';
import _get from 'lodash/get';
import { ISurvey, ISurveyVersion } from '@/type';
import { useParseQueryString } from '@/hooks';

export const useGetSurveyById = (
  id?: string,
): {
  surveyData: ISurvey;
  isLoading: boolean;
  currentSurveyVersion?: ISurveyVersion;
  latestVersion?: ISurveyVersion;
} => {
  const qsParams = useParseQueryString<{ version?: string }>();

  const { data, isLoading } = useQuery(
    ['getSurveyById', id, qsParams.version],
    () => SurveyService.getSurveyById(id),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );

  const surveyData = useMemo<ISurvey>(
    () => _get(data, 'data', { displayId: '', projectId: '', createdAt: '' }),
    [data],
  );

  const currentSurveyVersion = useMemo<ISurveyVersion | undefined>(
    () => surveyData.versions?.find(ver => ver.displayId === qsParams.version),
    [qsParams.version, surveyData.versions],
  );

  const latestVersion = useMemo<ISurveyVersion | undefined>(
    () => surveyData?.latestVersion,
    [surveyData.latestVersion],
  );

  return { surveyData, isLoading, currentSurveyVersion, latestVersion };
};
