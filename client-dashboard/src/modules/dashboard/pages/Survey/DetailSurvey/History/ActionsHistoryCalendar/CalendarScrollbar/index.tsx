import moment from 'moment';
import { memo } from 'react';
import Thumb from './Thumb';
import { useTranslation } from 'react-i18next';
import { MOMENT_FORMAT } from '@/enums';
import { useActionHistoryContext } from '@pages/Survey/DetailSurvey/History/ActionsHistoryCalendar/ActionHistoryContext/useActionHistoryContext';

function CalendarScrollbar() {
  const { t } = useTranslation();
  const { surveyData } = useActionHistoryContext();

  return (
    <div className={'w-[80px] overflow-hidden'}>
      <div className="h-full flex flex-col gap-3">
        <span className="font-semibold">{t('common.today')}</span>
        {surveyData && <Thumb />}
      </div>

      <span className="font-semibold">
        {surveyData?.createdAt
          ? moment(surveyData.createdAt).format(MOMENT_FORMAT.DOB)
          : ''}
      </span>
    </div>
  );
}

export default memo(CalendarScrollbar);
