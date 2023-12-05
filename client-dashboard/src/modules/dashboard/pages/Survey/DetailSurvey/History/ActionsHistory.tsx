import React from 'react';
import CalendarList from './ActionsHistoryCalendar/CalendarList';
import CalendarScrollbar from './ActionsHistoryCalendar/CalendarScrollbar';
import { ActionHistoryProvider } from '@pages/Survey/DetailSurvey/History/ActionsHistoryCalendar/ActionHistoryContext/ActionHistoryContext';

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
