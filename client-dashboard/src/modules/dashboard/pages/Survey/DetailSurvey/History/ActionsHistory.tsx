import React from 'react';
import CalendarList from './ActionsHistoryCalendar/CalendarList';
import CalendarScrollbar from './ActionsHistoryCalendar/CalendarScrollbar';

function ActionsHistory() {
  return (
    <div className={'h-full flex gap-[3rem] p-8'}>
      <CalendarScrollbar />
      <CalendarList />
    </div>
  );
}

export default ActionsHistory;
