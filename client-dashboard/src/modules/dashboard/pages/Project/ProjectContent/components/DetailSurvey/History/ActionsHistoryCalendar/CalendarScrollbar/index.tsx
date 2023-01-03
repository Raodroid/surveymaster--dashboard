import { Input } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import moment from 'moment';
import { memo, useMemo } from 'react';
import { useGetAllActionsHistory } from '../../../utils';
import { CalendarScrollbarWrapper, MonthsWrapper } from '../styles';
import Month from './Month';
import Thumb from './Thumb';
import { useGetSurveyById } from '../../../../Survey/util';
import { useParams } from 'react-router';
import { projectSurveyParams } from '../../../index';

export enum ACTIONS_HISTORY_ID {
  MONTHS = 'actions-history-months',
  MONTHS_WRAPPER = 'actions-history-months-wrapper',
}

function CalendarScrollbar() {
  const { histories } = useGetAllActionsHistory();
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
    <CalendarScrollbarWrapper>
      <div className="height-100 flex-column calendar-wrapper">
        <div className="input-wrapper flex-center">
          <Input disabled name="today" value="Today" />
        </div>
        <MonthsWrapper id={ACTIONS_HISTORY_ID.MONTHS_WRAPPER}>
          {surveyData ? <Thumb /> : null}

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
        </MonthsWrapper>
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
