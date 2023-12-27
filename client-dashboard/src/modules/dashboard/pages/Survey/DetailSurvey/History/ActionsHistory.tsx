import {ActionHistoryProvider} from './ActionsHistoryCalendar/ActionHistoryContext/ActionHistoryContext';
import CalendarList from './ActionsHistoryCalendar/CalendarList';
import CalendarScrollbar from './ActionsHistoryCalendar/CalendarScrollbar';

function ActionsHistory() {
  return (
    <ActionHistoryProvider>
      <div className={'h-full flex gap-[3rem] p-8'}>
        <CalendarScrollbar />
        <CalendarList />
      </div>
    </ActionHistoryProvider>
  );
}

export default ActionsHistory;
