import { memo, useCallback } from 'react';
import { MONTH_HEIGHT } from '../../../utils';
import { MonthWrapper } from '../styles';

// %
const MAX_WIDTH = 100;
const MIN_WIDTH = 20;

const MAX_MARGIN = 12;
const MIN_MARGIN = 8;

function Month(props: { month: string; renderLines?: boolean }) {
  const { month, renderLines = false } = props;

  const getRandomInRange = (min: number, max: number) => {
    const difference = max - min;
    let rand = Math.random();
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
    <MonthWrapper height={MONTH_HEIGHT}>
      {month}
      {renderLines &&
        Array(getRandomInRange(5, 8))
          .fill(1)
          .map((elm, index: number) => (
            <div key={index} className="line" style={generateStyle()}></div>
          ))}
    </MonthWrapper>
  );
}

export default memo(Month);
