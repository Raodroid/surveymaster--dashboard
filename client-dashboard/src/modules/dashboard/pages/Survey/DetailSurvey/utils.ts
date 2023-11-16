import { IAction } from '@/interfaces';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { SurveyService } from '@/services';
import { surveyActionType } from '@/type';
import _get from 'lodash/get';

export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

export const useGetAllActionsHistory = (): {
  histories: IAction[];
  isGetHistoryLoading: boolean;
} => {
  const params = useParams<projectSurveyParams>();

  const { data, isLoading } = useQuery(
    ['getActionsHistory', params],
    () =>
      SurveyService.getAllSurveyHistories({
        selectAll: true,
        surveyId: params.surveyId,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  return {
    histories: _get(data, 'data.data', []),
    isGetHistoryLoading: isLoading,
  };
};

export const MONTH_HEIGHT = 124;

export const genHandleActionType = (action: IAction, t) => {
  if (!action) return '';

  switch (action.actionType) {
    case surveyActionType[action.actionType]:
      return t(`actionType.${action.actionType}`, {
        params: action.params,
      });

    default:
      return t('actionType.noActionsYet');
  }
};
