import { IAction } from '@/interfaces';
import { useQueries, useQuery } from 'react-query';
import { useParams } from 'react-router';
import { SurveyService } from '@/services';
import { QsParams, surveyActionType } from '@/type';
import _get from 'lodash/get';
import {
  getParentBlockSort,
  getParentChildrenFieldName,
  getParentFieldName,
  SurveyDataTreeNode,
  transformToSurveyDataTreeNode,
  useSurveyFormContext,
} from '@pages/Survey';
import { useField } from 'formik';
import { useCallback, useMemo } from 'react';
import { useParseQueryString } from '@/hooks';
import moment from 'moment';

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
    ['getAllActionsHistory', params],
    () =>
      SurveyService.getAllSurveyHistories({
        selectAll: true,
        surveyId: params.surveyId,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!params.surveyId,
    },
  );

  return {
    histories: _get(data, 'data.data', []),
    isGetHistoryLoading: isLoading,
  };
};

export const useGetActionsHistory = (
  surveyId: string,
): {
  histories: IAction[];
  isGetHistoryLoading: boolean;
} => {
  const qsParams = useParseQueryString<QsParams>();

  const { data, isLoading } = useQuery(
    ['getActionsHistory', surveyId],
    () =>
      SurveyService.getAllSurveyHistories({
        surveyId,
        createdFrom: qsParams.createdFrom,
        createdTo: qsParams.createdTo,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!surveyId,
    },
  );

  return {
    histories: _get(data, 'data.data', []),
    isGetHistoryLoading: isLoading,
  };
};

type IMonthQuery = {
  createFrom: string;
  createdTo: string;
  monthName: string;
  monthNumber: number;
};

export const useGetTimelineActionsHistory = (
  surveyId?: string | undefined,
  createdDate?: string | undefined,
): {
  data: Array<IAction[]>;
  months: IMonthQuery[];
} => {
  const months = useMemo<IMonthQuery[]>(() => {
    if (!createdDate) return [];

    const monthGap = moment().month() - moment(createdDate).month();

    let dateStart = moment();

    return [...Array(monthGap + 1).keys()].map(() => {
      const newItem: IMonthQuery = {
        createFrom: dateStart.startOf('month').format(),
        createdTo: dateStart.endOf('month').format(),
        monthName: dateStart.format('MMM'),
        monthNumber: dateStart.month(),
      };
      dateStart = dateStart.subtract(1, 'month').startOf('months');

      return newItem;
    });
  }, [createdDate]);

  const userQueries = useQueries(
    months.map(month => {
      return {
        refetchOnWindowFocus: false,
        enabled: !!surveyId,
        queryKey: ['getActionsHistory', { ...month }],
        queryFn: () =>
          SurveyService.getAllSurveyHistories({
            surveyId,
            createdFrom: month.createFrom,
            createdTo: month.createdTo,
            take: 1,
            page: 1,
          }),
      };
    }),
  );

  return {
    data: userQueries.map(query => _get(query.data, 'data.data', [])),
    months,
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

export const useSurveyBlockAction = (focusBlock: SurveyDataTreeNode) => {
  const fieldName = focusBlock.fieldName;

  const parentLayerFieldName = getParentChildrenFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);

  const { setSurveyFormContext } = useSurveyFormContext();

  const [{ value }] = useField<SurveyDataTreeNode>(fieldName);

  const handleRemoveBlock = useCallback(() => {
    const parentBlockSort = getParentBlockSort(parentLayerFieldName);
    if (!isNaN(parentBlockSort)) {
      const parentFieldName = getParentFieldName(fieldName);
      setParentNodeValue(
        transformToSurveyDataTreeNode(
          (parentNodeValue || []).filter(node => node.fieldName !== fieldName),
          parentBlockSort,
          parentFieldName,
        ),
      );
    } else {
      setParentNodeValue(
        transformToSurveyDataTreeNode(
          (parentNodeValue || []).filter(node => node.fieldName !== fieldName),
        ),
      );
    }
    setSurveyFormContext(oldState => ({
      ...oldState,
      tree: {
        ...oldState.tree,
        focusBlock: undefined,
      },
    }));
  }, [
    fieldName,
    parentLayerFieldName,
    parentNodeValue,
    setParentNodeValue,
    setSurveyFormContext,
  ]);

  const handleDuplicateBlock = useCallback(() => {
    if (!parentNodeValue) return;

    const parentBlockSort = getParentBlockSort(fieldName);

    if (!isNaN(parentBlockSort)) {
      const parentFieldName = fieldName.match(/(.*)\.children.*$/)?.[1];

      setParentNodeValue(
        transformToSurveyDataTreeNode(
          [...parentNodeValue, value],
          parentBlockSort,
          parentFieldName,
        ),
      );
      return;
    }
    setParentNodeValue(
      transformToSurveyDataTreeNode([...parentNodeValue, value]),
    );
  }, [fieldName, parentNodeValue, setParentNodeValue, value]);

  return { handleDuplicateBlock, handleRemoveBlock };
};
