import useParseQueryString from 'hooks/useParseQueryString';
import { IAction } from 'interfaces';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { ProjectService, SurveyService } from 'services';
import { surveyActionType } from 'type';
import { QsParams } from '../ProjectFilter';

export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

export const useGetSurveyDetail = () => {
  const params = useParams<projectSurveyParams>();

  const { data: project, isLoading: isProjectLoading } = useQuery(
    ['getProjectById', params.projectId],
    () => ProjectService.getProjectById(params.projectId),
    { refetchOnWindowFocus: false },
  );

  const { data: survey, isLoading: isSurveyLoading } = useQuery(
    ['getSurveyById', params.surveyId],
    () => SurveyService.getSurveyById(params.surveyId),
    { refetchOnWindowFocus: false },
  );

  return {
    project,
    isProjectLoading,
    survey,
    isSurveyLoading,
  };
};

export const useGetActionsHistory = () => {
  const params = useParams<projectSurveyParams>();
  const qsParams = useParseQueryString<QsParams>();

  const { data, isLoading } = useQuery(
    ['getActionsHistory', params, qsParams],
    () =>
      SurveyService.getSurveyHistories({
        surveyId: params.surveyId,
        createdFrom: qsParams.createdFrom,
        createdTo: qsParams.createdTo,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  return { histories: data, isGetHistoryLoading: isLoading };
};

export const useGetAllActionsHistory = () => {
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

  return { histories: data, isGetHistoryLoading: isLoading };
};

export const MONTH_HEIGHT = 124;

export const useHandleActionType = (action: IAction) => {
  const { t } = useTranslation();
  if (!action) return '';

  const parseParams = () => {
    try {
      return JSON.parse(action.params);
    } catch {
      return '';
    }
  };
  const params = parseParams();

  switch (action.actionType) {
    case surveyActionType[action.actionType]:
      return t(`actionType.${action.actionType}`, {
        params,
      });

    default:
      return t('actionType.noActionsYet');
  }
};
