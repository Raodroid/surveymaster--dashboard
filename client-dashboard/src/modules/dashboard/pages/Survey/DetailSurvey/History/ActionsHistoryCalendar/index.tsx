import CalendarList from './CalendarList';
import CalendarScrollbar from './CalendarScrollbar';
import { ActionsHistoryCalendarContentWrapper } from './styles';

function ActionsHistoryCalendar() {
  return (
    <ActionsHistoryCalendarContentWrapper className="flex">
      <CalendarScrollbar />
      <CalendarList />
    </ActionsHistoryCalendarContentWrapper>
  );
}

export default ActionsHistoryCalendar;
