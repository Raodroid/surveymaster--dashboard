import { Divider, Empty } from 'antd';
import useParseQueryString from 'hooks/useParseQueryString';
import { IAction } from 'interfaces';
import { CustomSpinSuspense } from 'modules/common/styles';
import moment from 'moment';
import { useMemo } from 'react';
import SimpleBar from 'simplebar-react';
import { surveyActionType } from 'type';
import { QsParams } from '../../../../ProjectFilter';
import { useGetAllActionsHistory, useGetSurveyDetail } from '../../../utils';
import Action from './Action';
import { CalendarListWrapper } from './styles';

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

  const { survey } = useGetSurveyDetail();
  const { histories, isGetHistoryLoading } = useGetAllActionsHistory();

  const createAction = useMemo<IAction>(() => {
    if (!histories || !survey) return initialAction;
    const actions = histories?.data.data.filter(
      action => action.createdAt === survey.data.createdAt,
    );
    return actions.find(
      action => action.actionType === surveyActionType.SURVEY_CREATED,
    );
  }, [histories, survey]);

  const todayAction = useMemo<IAction>(() => {
    return (
      histories?.data.data.find(action => {
        return moment()
          .startOf('day')
          .isSame(moment(action.createdAt).startOf('day'));
      }) || initialAction
    );
  }, [histories]);

  const actionsFiltered = useMemo<IAction[]>(() => {
    const filter = histories?.data.data
      .filter((action: IAction) =>
        moment(action.createdAt).isBetween(
          moment(qsParams.createdFrom),
          moment(qsParams.createdTo),
        ),
      )
      .sort((a: IAction, b: IAction) =>
        moment(a.createdAt).isBefore(moment(b.createdAt), 's') ? -1 : 1,
      );
    return filter;
  }, [qsParams, histories]);

  return (
    <CalendarListWrapper>
      <CustomSpinSuspense spinning={isGetHistoryLoading}>
        <Action action={createAction} />
        <Divider className="list-divider" />
        <div className="list flex-column">
          <SimpleBar
            style={{
              maxHeight: '100%',
              paddingRight: 10,
            }}
          >
            {actionsFiltered
              ? actionsFiltered.map(action => (
                  <Action key={action.id} action={action} />
                ))
              : null}
            {actionsFiltered && actionsFiltered.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : null}
          </SimpleBar>
        </div>
        <Divider className="list-divider" />
        <Action action={todayAction} today />
      </CustomSpinSuspense>
    </CalendarListWrapper>
  );
}

export default CalendarList;
