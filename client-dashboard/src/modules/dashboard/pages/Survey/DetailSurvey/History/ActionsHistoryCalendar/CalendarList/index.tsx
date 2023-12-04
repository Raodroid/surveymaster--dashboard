import { Divider, List } from 'antd';
import Action from './Action';
import { SimpleBarCustom } from '@/customize-components';
import { useActionHistoryContext } from '@pages/Survey/DetailSurvey/History/ActionsHistoryCalendar/ActionHistoryContext/useActionHistoryContext';

function CalendarList() {
  const { displayHistory, createAction, todayAction } =
    useActionHistoryContext();

  return (
    <div className={'flex-1 h-full flex flex-col'}>
      <Action action={todayAction} today />

      <Divider className={'mb-0'} />

      <div className={'flex-1 overflow-hidden'}>
        <SimpleBarCustom>
          <List
            itemLayout="horizontal"
            dataSource={displayHistory}
            renderItem={action => (
              <List.Item key={action.id}>
                <Action key={action.id} action={action} />
              </List.Item>
            )}
          />
        </SimpleBarCustom>
      </div>

      <Divider className={'mt-0'} />

      <Action action={createAction} />
    </div>
  );
}

export default CalendarList;
