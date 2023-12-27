import {createContext, ReactElement, useRef, useState} from 'react';
import {useParseQueryString} from '@/hooks';
import {IPaginationResponse, ISurvey, QsParams} from '@/type';
import {useParams} from 'react-router';
import {projectSurveyParams} from '@pages/Survey';
import {useQueries, useQuery} from 'react-query';
import {SurveyService} from '@/services';
import moment from 'moment';
import {IAction} from '@/interfaces';
import _get from 'lodash/get';
import {onError} from '@/utils';
import {AxiosResponse} from 'axios';
import {Spin} from 'antd';

type IMonthQuery = {
  createdFrom: string;
  createdTo: string;
  monthName: string;
  monthNumber: number;
};

interface IActionHistoryContext {
  displayHistory: IAction[];
  todayAction: IAction | undefined;
  createAction: IAction | undefined;
  surveyData: ISurvey | undefined;
  months: IMonthQuery[];
  monthData: Record<string, { data?: IAction[]; index: number }>;
}

const initValueContext: IActionHistoryContext = {
  displayHistory: [],
  todayAction: undefined,
  createAction: undefined,
  surveyData: undefined,
  months: [],
  monthData: {},
};

export const ActionHistortContext =
  createContext<IActionHistoryContext>(initValueContext);

const ActionHistoryProvider = (props: { children?: ReactElement }) => {
  const [context, setContext] =
    useState<IActionHistoryContext>(initValueContext);
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
          const createdDate = res.data?.createdAt;
          const yearGap = moment().year() - moment(createdDate).year();
          let monthGap = moment().month() - moment(createdDate).month();

          if (yearGap) {
            monthGap = monthGap + 12 * yearGap;
          }

          let dateStart = moment();

          return [...Array(monthGap + 1).keys()].map(() => {
            const newItem: IMonthQuery = {
              createdFrom: dateStart.startOf('month').format(),
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

  const getMonthTimelineQueries = useQueries(
    context.months.map((month, index, arr) => {
      return {
        queryFn: () =>
          SurveyService.getSurveyHistories({
            surveyId: params.surveyId,
            createdFrom: month.createdFrom,
            createdTo: month.createdTo,
            take: 1,
            page: 1,
            order: 'ASC',
          }),
        refetchOnWindowFocus: false,
        enabled: !!params.surveyId,
        queryKey: ['getActionsHistory', { ...month }],
        onSuccess: (res: AxiosResponse<IPaginationResponse<IAction>>) => {
          const record = res.data.data?.[0];

          const newItem: IActionHistoryContext['monthData'] = {
            [moment(month?.createdFrom).startOf('month').format()]: {
              data: res.data.data,
              index,
            },
          };

          setContext(s => ({
            ...s,
            monthData: {
              ...s.monthData,
              ...newItem,
            },
            createAction: index === arr.length - 1 ? record : s.createAction,
          }));
        },
      };
    }),
  );

  const loading = getMonthTimelineQueries.reduce(
    (res: boolean, i) => i.isLoading || res,
    false,
  );

  const getTodayActions = useQuery(
    ['getTodayActionsHistories', params],
    () =>
      SurveyService.getSurveyHistories({
        surveyId: params.surveyId,
        take: 1,
        page: 1,
        createdFrom: moment().startOf('date').format(),
        createdTo: moment().endOf('date').format(),
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!params.surveyId,
      onSuccess: (res: AxiosResponse<IPaginationResponse<IAction>>) => {
        const record = res.data.data?.[0];
        setContext(oldState => ({
          ...oldState,
          todayAction: record,
        }));
      },
    },
  );

  const getActionsHistories = useQuery(
    ['getActionsHistories', params, qsParams],
    () =>
      SurveyService.getSurveyHistories({
        surveyId: params.surveyId,
        selectAll: true,
        createdFrom: qsParams.createdFrom || moment().startOf('month').format(),
        createdTo: moment(qsParams.createdFrom).endOf('month').format(),
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
      <Spin
        spinning={
          getActionsHistories.isLoading ||
          surveyDataQuery.isLoading ||
          loading ||
          getTodayActions.isLoading
        }
      >
        <div className={'h-full'}>{props.children}</div>
      </Spin>
    </ActionHistortContext.Provider>
  );
};

export { ActionHistoryProvider };
