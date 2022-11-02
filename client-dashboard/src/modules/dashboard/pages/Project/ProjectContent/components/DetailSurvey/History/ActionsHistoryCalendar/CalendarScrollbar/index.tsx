import { Input } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import moment from 'moment';
import { memo, useMemo } from 'react';
import { useGetAllActionsHistory, useGetSurveyDetail } from '../../../utils';
import { CalendarScrollbarWrapper, MothsWrapper } from '../styles';
import Month from './Month';
import Thumb from './Thumb';

export enum ACTIONS_HISTORY_ID {
  MONTHS = 'actions-history-months',
  MONTHS_WRAPPER = 'actions-history-months-wrapper',
}

function CalendarScrollbar() {
  const { histories } = useGetAllActionsHistory();
  const { survey } = useGetSurveyDetail();

  const months = useMemo(() => {
    if (!survey) return [];

    const dateStart = moment(survey?.data.createdAt)
      .startOf('month')
      .startOf('day');
    const dateEnd = moment();
    const months: string[] = [];
    while (dateEnd.isSameOrAfter(dateStart)) {
      months.push(dateStart.format('MMM.YYYY'));
      dateStart.add(1, 'month');
    }
    return months.reverse();
  }, [survey]);

  const monthsHaveData = useMemo(() => {
    const months = histories?.data.data.map(action =>
      moment(action.createdAt).format('MMM.YYYY'),
    );
    return [...new Set(months)];
  }, [histories]);

  return (
    <CalendarScrollbarWrapper>
      <div className="height-100 flex-column calendar-wrapper">
        <Input disabled name="today" value="Today" />
        <MothsWrapper id={ACTIONS_HISTORY_ID.MONTHS_WRAPPER}>
          {survey ? <Thumb /> : null}

          <div className="months" id={ACTIONS_HISTORY_ID.MONTHS}>
            {months.map((month: string, index: number) => {
              const props: {
                key: string;
                month: string;
                renderLines?: boolean;
              } = {
                key: month + index,
                month: moment(month, 'MMM.YYYY').format('MMM'),
                renderLines: true,
              };
              if (!monthsHaveData.some(elm => elm === month))
                delete props?.renderLines;
              return <Month {...props} />;
            })}
          </div>
        </MothsWrapper>
        <ControlledInput
          disabled
          name="createdAt"
          inputType={INPUT_TYPES.INPUT}
        />
      </div>
    </CalendarScrollbarWrapper>
  );
}

export default memo(CalendarScrollbar);
