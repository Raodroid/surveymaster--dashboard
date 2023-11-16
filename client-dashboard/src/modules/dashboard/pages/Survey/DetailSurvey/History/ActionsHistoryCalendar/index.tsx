import CalendarList from './CalendarList';
import CalendarScrollbar from './CalendarScrollbar';
import { ActionsHistoryCalendarContentWrapper } from './styles';

function ActionsHistoryCalendar() {
  return (
    <div className={'h-full flex gap-[3rem] p-8'}>
      <CalendarScrollbar />
      <CalendarList />
    </div>
  );
}

export default ActionsHistoryCalendar;
