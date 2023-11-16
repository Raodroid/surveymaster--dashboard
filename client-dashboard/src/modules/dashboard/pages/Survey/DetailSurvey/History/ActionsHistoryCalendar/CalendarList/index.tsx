import { Divider, List, Spin } from 'antd';
import { useParseQueryString } from '@/hooks/useParseQueryString';
import { IAction } from '@/interfaces';
import moment from 'moment';
import { useMemo } from 'react';
import { QsParams, surveyActionType } from '@/type';

import {
  projectSurveyParams,
  useGetAllActionsHistory,
  useGetSurveyById,
} from '@pages/Survey';
import Action from './Action';
import { useParams } from 'react-router';
import { SimpleBarCustom } from '@/customize-components';

const initialAction: IAction = {
  actionType: '',
  params: '',
  owner: {
    firstName: '',
    lastName: '',
  },
  createdAt: '',
  createdBy: '',
  updatedAt: '',
  deletedAt: '',
  id: '',
  surveyId: '',
};

function CalendarList() {
  const qsParams = useParseQueryString<QsParams>();
  const params = useParams<projectSurveyParams>();
  const { surveyData } = useGetSurveyById(params.surveyId);
  const { histories, isGetHistoryLoading } = useGetAllActionsHistory();

  const createAction = useMemo<IAction>(() => {
    if (!histories || !surveyData) return initialAction;
    const actions = histories?.filter(action =>
      moment(action.createdAt).isSame(surveyData?.createdAt),
    );
    return actions.find(
      action => action.actionType === surveyActionType.SURVEY_VERSION_CREATED,
    ) as IAction;
  }, [histories, surveyData]);

  const todayAction = useMemo<IAction>(() => {
    return (
      histories?.find(action => {
        return moment()
          .startOf('day')
          .isSame(moment(action.createdAt).startOf('day'));
      }) || initialAction
    );
  }, [histories]);

  const actionsFiltered = useMemo<IAction[]>(() => {
    return histories
      ?.filter((action: IAction) =>
        moment(action.createdAt).isBetween(
          moment(qsParams.createdFrom),
          moment(qsParams.createdTo),
        ),
      )
      .sort((a: IAction, b: IAction) =>
        moment(a.createdAt).isBefore(moment(b.createdAt), 's') ? -1 : 1,
      );
  }, [qsParams, histories]);

  return (
    <div className={'flex-1 h-full flex flex-col'}>
      <Action action={todayAction} today />

      <Divider className={'mb-0'} />

      <div className={'flex-1 overflow-hidden'}>
        <Spin spinning={isGetHistoryLoading}>
          <SimpleBarCustom>
            <List
              itemLayout="horizontal"
              dataSource={actionsFiltered}
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

      <Action action={createAction} />
    </div>
  );
}

export default CalendarList;
