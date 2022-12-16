import { useQuery } from 'react-query';
import { SurveyService } from '../../../../../../../services';
import { onError } from '../../../../../../../utils';
import { useMemo } from 'react';
import _get from 'lodash/get';
import { ISurvey, ISurveyVersion } from '../../../../../../../type';
import useParseQueryString from '../../../../../../../hooks/useParseQueryString';

export const useGetSurveyById = (
  id?: string,
): {
  surveyData: ISurvey;
  isLoading: boolean;
  currentSurveyVersion?: ISurveyVersion;
} => {
  const qsParams = useParseQueryString<{ version?: string }>();

  const { data, isLoading } = useQuery(
    ['getSurveyById', id],
    () => SurveyService.getSurveyById(id),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );

  const surveyData = useMemo<ISurvey>(() => _get(data, 'data', {}), [data]);

  const currentSurveyVersion = useMemo<ISurveyVersion | undefined>(
    () => surveyData.versions?.find(ver => ver.id === qsParams.version),
    [qsParams.version, surveyData.versions],
  );

  return { surveyData, isLoading, currentSurveyVersion };
};
