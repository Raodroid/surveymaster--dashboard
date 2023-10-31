import React from 'react';
import { useTranslation } from 'react-i18next';
import ActionsHistoryCalendar from './ActionsHistoryCalendar';
import { ActionsHistoryCalendarWrapper } from './styles';

function ActionsHistory() {
  const { t } = useTranslation();
  return (
    <ActionsHistoryCalendarWrapper className="actionsHistory">
      <div className="title">{t('common.actionsHistory')}</div>
      <ActionsHistoryCalendar />
    </ActionsHistoryCalendarWrapper>
  );
}

export default ActionsHistory;
