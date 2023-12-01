import { Divider, List, Spin } from 'antd';
import { useParseQueryString } from '@/hooks/useParseQueryString';
import { IAction } from '@/interfaces';
import moment from 'moment';
import { useMemo } from 'react';
import { QsParams } from '@/type';

import { projectSurveyParams } from '@pages/Survey';
import Action from './Action';
import { useParams } from 'react-router';
import { SimpleBarCustom } from '@/customize-components';
import { useQuery } from 'react-query';
import { SurveyService } from '@/services';
import _get from 'lodash/get';

function CalendarList() {
  const qsParams = useParseQueryString<QsParams>();
  const params = useParams<projectSurveyParams>();

  const getActionsHistories = useQuery(
    ['getActionsHistories', params],
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
    },
  );

  const histories = useMemo<IAction[]>(
    () => _get(getActionsHistories.data, 'data.data', []),
    [getActionsHistories],
  );

  return (
    <div className={'flex-1 h-full flex flex-col'}>
      {/*<Action action={todayAction} today />*/}

      <Divider className={'mb-0'} />

      <div className={'flex-1 overflow-hidden'}>
        <Spin spinning={getActionsHistories.isLoading}>
          <SimpleBarCustom>
            <List
              itemLayout="horizontal"
              dataSource={histories}
              renderItem={action => (
                <List.Item key={action.id}>
                  <Action key={action.id} action={action} />
                </List.Item>
              )}
            />
          </SimpleBarCustom>
        </Spin>
      </div>

      <Divider className={'mt-0'} />

      {/*<Action action={createAction} />*/}
    </div>
  );
}

export default CalendarList;
