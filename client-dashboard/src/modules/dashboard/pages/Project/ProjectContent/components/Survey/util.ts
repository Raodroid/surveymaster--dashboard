import { useQuery } from 'react-query';
import { SurveyService } from '../../../../../../../services';
import { onError } from '../../../../../../../utils';
import { useMemo } from 'react';
import _get from 'lodash/get';
import { ISurvey } from '../../../../../../../type';

export const useGetSurveyById = (
  id?: string,
): { surveyData: ISurvey; isLoading: boolean } => {
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

  return { surveyData, isLoading };
};
