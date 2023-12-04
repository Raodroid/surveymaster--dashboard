import React, { createContext, ReactElement, useRef, useState } from 'react';
import { HannahCustomSpin } from '@/modules/dashboard';
import { useParseQueryString } from '@/hooks';
import { ISurvey, QsParams } from '@/type';
import { useParams } from 'react-router';
import { projectSurveyParams } from '@pages/Survey';
import { useQueries, useQuery } from 'react-query';
import { SurveyService } from '@/services';
import moment from 'moment';
import { IAction } from '@/interfaces';
import _get from 'lodash/get';
import { onError } from '@/utils';

type IMonthQuery = {
  createFrom: string;
  createdTo: string;
  monthName: string;
  monthNumber: number;
};

interface IActionHistortContext {
  displayHistory: IAction[];
  todayAction: IAction | undefined;
  createAction: IAction | undefined;
  surveyData: ISurvey | undefined;
  months: IMonthQuery[];
  monthData: Record<string, IAction[]>;
}

const initValueContext: IActionHistortContext = {
  displayHistory: [],
  todayAction: undefined,
  createAction: undefined,
  surveyData: undefined,
  months: [],
  monthData: {},
};

export const ActionHistortContext =
  createContext<IActionHistortContext>(initValueContext);

const ActionHistoryProvider = (props: { children?: ReactElement }) => {
  const [context, setContext] =
    useState<IActionHistortContext>(initValueContext);
  const wrapperRef = useRef<any>();

  const qsParams = useParseQueryString<QsParams>();
  const params = useParams<projectSurveyParams>();

  const surveyDataQuery = useQuery(
    ['getSurveyById', params.surveyId],
    () => SurveyService.getSurveyById(params.surveyId),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: !!params.surveyId,
      onSuccess: res => {
        const months = (() => {
          const monthGap =
            moment().month() - moment(res.data?.createdAt).month();

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
        })();

        setContext(s => ({
          ...s,
          surveyData: res.data,
          months: months ? months : [],
        }));
      },
    },
  );

  const userQueries = useQueries(
    context.months.map((month, index, arr) => {
      return {
        queryFn: () =>
          SurveyService.getAllSurveyHistories({
            surveyId: params.surveyId,
            createdFrom: month.createFrom,
            createdTo: month.createdTo,
            take: 1,
            page: 1,
            order: 'ASC',
          }),
        refetchOnWindowFocus: false,
        enabled: !!params.surveyId,
        queryKey: ['getActionsHistory', { ...month }],
        onSuccess: res => {
          const record = res.data.data?.[0];
          console.log({ index, record: res.data });

          const createdDate = res.data.data?.[0].createdAt;

          const newItem = createdDate
            ? { [moment(createdDate).startOf('month').format()]: res.data.data }
            : undefined;

          setContext(s => ({
            ...s,
            monthData: newItem
              ? {
                  ...s.monthData,
                  ...newItem,
                }
              : s.monthData,
            todayAction: index === 0 ? record : s.todayAction,
            createAction: index === arr.length - 1 ? record : s.createAction,
          }));
        },
      };
    }),
  );

  const getActionsHistories = useQuery(
    ['getActionsHistories', params, qsParams],
    () =>
      SurveyService.getAllSurveyHistories({
        surveyId: params.surveyId,
        selectAll: true,
        createdTo: qsParams.createdTo || moment().startOf('month').format(),
        createdFrom: qsParams.createdFrom || moment().format(),
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!params.surveyId,
      onSuccess: res => {
        setContext(oldState => ({
          ...oldState,
          displayHistory: _get(res, 'data.data', []),
        }));
      },
    },
  );

  return (
    <ActionHistortContext.Provider
      value={{
        ...context,
      }}
    >
      <div ref={wrapperRef} className={'h-full'}>
        <HannahCustomSpin
          parentRef={wrapperRef}
          spinning={getActionsHistories.isLoading || surveyDataQuery.isLoading}
        />
        {props.children}
      </div>
    </ActionHistortContext.Provider>
  );
};

export { ActionHistoryProvider };
