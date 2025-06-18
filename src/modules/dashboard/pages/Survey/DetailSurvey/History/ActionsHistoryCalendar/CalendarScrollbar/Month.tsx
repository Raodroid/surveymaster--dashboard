import { generateRandom } from '@/modules/common/funcs';
import { memo, useCallback } from 'react';
import { MonthWrapper } from '../styles';
import { MONTH_HEIGHT } from '@pages/Survey/DetailSurvey/History/ActionsHistoryCalendar/CalendarScrollbar/Thumb';

// %
const MAX_WIDTH = 100;
const MIN_WIDTH = 20;

const MAX_MARGIN = 12;
const MIN_MARGIN = 8;

function Month(props: { month: string; renderLines?: boolean }) {
  const { month, renderLines = false } = props;

  const getRandomInRange = (min: number, max: number) => {
    const difference = max - min;
    let rand = generateRandom();
    rand = Math.floor(rand * difference);
    return rand + min;
  };

  const generateStyle = useCallback(() => {
    return {
      width: `${getRandomInRange(MIN_WIDTH, MAX_WIDTH)}%`,
      marginTop: `${getRandomInRange(MIN_MARGIN, MAX_MARGIN)}px`,
      marginBottom: `${getRandomInRange(MIN_MARGIN, MAX_MARGIN)}px`,
    };
  }, []);

  return (
    <MonthWrapper height={MONTH_HEIGHT} className={'bg-[#F9F9F9CC] '}>
      {month}
      {renderLines
        ? Array(getRandomInRange(5, 8))
            .fill(1)
            .map((elm, index: number) => (
              <div key={index} className="line" style={generateStyle()}></div>
            ))
        : null}
    </MonthWrapper>
  );
}

export default memo(Month);
