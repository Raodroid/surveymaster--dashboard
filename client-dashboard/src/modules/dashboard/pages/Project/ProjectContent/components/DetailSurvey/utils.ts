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
    ['getProject', params.projectId],
    () => ProjectService.getProjectById(params.projectId),
    { refetchOnWindowFocus: false },
  );

  const { data: survey, isLoading: isSurveyLoading } = useQuery(
    ['getSurvey', params.surveyId],
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

enum groupType {
  NORMAL = 'NORMAL',
  CHANGE = 'CHANGE',
  REST = 'REST',
}

const actionGroup = {
  NORMAL: [
    surveyActionType.SURVEY_CREATED,
    surveyActionType.SURVEY_ACTIVATE,
    surveyActionType.SURVEY_CLOSE,
    surveyActionType.CHANGE_ORDER_QUESTION,
  ],
  CHANGE: [
    surveyActionType.CHANGE_SURVEY_NAME,
    surveyActionType.CHANGE_SURVEY_REMARK,
  ],
};

const getGroupTypeOfAction = (action: string) => {
  if (!action) return '';
  const actionGroupValues = Object.values(actionGroup);
  const actionGroupKey = Object.keys(actionGroup);
  const index = actionGroupValues.findIndex(group =>
    group.some(act => act === action),
  );

  return index > -1 ? groupType[actionGroupKey[index]] : groupType.REST;
};

export const useHandleActionType = (action: IAction) => {
  const { t } = useTranslation();
  if (!action) return '';

  const params = action.params ? JSON.parse(action.params) : '';
  const groupOfAction = getGroupTypeOfAction(action.actionType);

  switch (groupOfAction) {
    case groupType.NORMAL:
      return t(`actionType.${action.actionType}`);
    case groupType.CHANGE:
      return (
        t(`actionType.${action.actionType}`) +
        ' ' +
        t('actionGroupType.change', {
          params: {
            oldSurvey: {
              title:
                action.actionType === surveyActionType.CHANGE_SURVEY_NAME
                  ? params.oldSurvey?.name
                  : params.oldSurvey?.remark,
            },
            newSurvey: {
              title:
                action.actionType === surveyActionType.CHANGE_SURVEY_NAME
                  ? params.newSurvey?.name
                  : params.newSurvey?.remark,
            },
          },
        })
      );
    case groupType.REST:
      return (
        t(`actionType.${action.actionType}`) +
        ' ' +
        t('actionGroupType.rest', {
          params,
        })
      );

    default:
      return t('actionType.noActionsYet');
  }
};
