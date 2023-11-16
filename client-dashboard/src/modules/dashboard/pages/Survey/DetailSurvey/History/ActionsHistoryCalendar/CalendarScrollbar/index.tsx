import moment from 'moment';
import { memo, useMemo } from 'react';
import { useGetAllActionsHistory } from '@pages/Survey';
import Month from './Month';
import Thumb from './Thumb';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';
import { useParams } from 'react-router';
import { projectSurveyParams } from '../../../DetailSurvey';
import { useTranslation } from 'react-i18next';
import { MOMENT_FORMAT } from '@/enums';

export enum ACTIONS_HISTORY_ID {
  MONTHS = 'actions-history-months',
  MONTHS_WRAPPER = 'actions-history-months-wrapper',
  THUMB = 'actions-history-thumb',
}

function CalendarScrollbar() {
  const { histories } = useGetAllActionsHistory();
  const { t } = useTranslation();
  const params = useParams<projectSurveyParams>();
  const { surveyData } = useGetSurveyById(params.surveyId);

  const months = useMemo(() => {
    if (!surveyData) return [];

    const dateStart = moment(surveyData?.createdAt)
      .startOf('month')
      .startOf('day');
    const dateEnd = moment();
    const months: string[] = [];
    while (dateEnd.isSameOrAfter(dateStart)) {
      months.push(dateStart.format('MMM.YYYY'));
      dateStart.add(1, 'month');
    }
    return months.reverse();
  }, [surveyData]);

  const monthsHaveData = useMemo(() => {
    const months = histories?.map(action =>
      moment(action.createdAt).format('MMM.YYYY'),
    );
    return [...new Set(months)];
  }, [histories]);

  return (
    <div className={'w-[80px] overflow-hidden'}>
      <div className="h-full flex flex-col gap-3">
        <span className="font-semibold">{t('common.today')}</span>

        <div
          className={'relative overflow-hidden flex-1 w-[50px]'}
          id={ACTIONS_HISTORY_ID.MONTHS_WRAPPER}
        >
          {surveyData ? <Thumb /> : null}

          <div className="relative" id={ACTIONS_HISTORY_ID.MONTHS}>
            {months.map((month: string, index: number) => {
              const props: {
                month: string;
                renderLines?: boolean;
              } = {
                month: moment(month, 'MMM.YYYY').format('MMM'),
                renderLines: true,
              };
              if (!monthsHaveData.some(elm => elm === month))
                delete props?.renderLines;
              return <Month key={month + index} {...props} />;
            })}
          </div>
        </div>

        <span className="font-semibold">
          {surveyData.createdAt
            ? moment(surveyData.createdAt).format(MOMENT_FORMAT.DOB)
            : ''}
        </span>
      </div>
    </div>
  );
}

export default memo(CalendarScrollbar);
