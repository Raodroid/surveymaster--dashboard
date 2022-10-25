import CalendarList from './CalendarList';
import CalendarScrollbar from './CalendarScrollbar';
import { ActionsHistoryCalendarContentWrapper } from './styles';

export const MONTH_HEIGHT = 124;

function ActionsHistoryCalendar() {
  return (
    <ActionsHistoryCalendarContentWrapper className="flex">
      <CalendarScrollbar />
      <CalendarList />
    </ActionsHistoryCalendarContentWrapper>
  );
}

export default ActionsHistoryCalendar;
