import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { projectSurveyParams } from '@pages/Survey';
import { ThumbWrapper } from '../styles';
import { IGetParams } from '@/type';
import { useNavigate } from 'react-router-dom';
import { useParseQueryString } from '@/hooks';
import qs from 'qs';
import { usePrevious } from '@/utils';
import { useParams } from 'react-router';
import { useActionHistoryContext } from '../ActionHistoryContext/useActionHistoryContext';
import Month from './Month';

export const MONTH_HEIGHT = 124;

const INPUTS_HEIGHT = 56;
const MIN_ACTIONS_HISTORY_HEIGHT = 478;
const MIN_MONTHS_HEIGHT = MIN_ACTIONS_HISTORY_HEIGHT - INPUTS_HEIGHT;

const getPixelNumber = (input?: string): number => {
  if (!input) return 0;
  const transform = Number(input.replace('px', ''));
  return isNaN(transform) ? 0 : transform;
};

function Thumb() {
  const { months, monthData } = useActionHistoryContext();
  const navigate = useNavigate();
  const qsParams = useParseQueryString<IGetParams>();

  const monthsRef = useRef<HTMLElement>();
  const thumbRef = useRef<HTMLElement>();
  const monthsWrapperRef = useRef<HTMLDivElement>();

  const [monthsHeight, setMonthHeight] = useState<number>(0);

  const directionRef = useRef<'up' | 'down' | null>(null);

  const redundantSpace = Math.floor(
    (monthsWrapperRef?.current?.offsetHeight || 0) % MONTH_HEIGHT,
  );

  useEffect(() => {
    //calc thumb's moving space
    if (!monthsWrapperRef.current) return;
    const handleResize = () => {
      setMonthHeight(
        Math.max(
          MIN_MONTHS_HEIGHT,
          Math.min(
            monthsWrapperRef.current?.offsetHeight || 1000,
            months.length * MONTH_HEIGHT,
          ),
        ),
      );
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [months.length]);

  const maxThumbMovingDistance = useMemo<number>(() => {
    const monthElement = monthsRef.current;

    if (!monthElement) return 0;

    return (
      (monthsHeight < monthElement?.offsetHeight
        ? monthsHeight
        : monthElement?.offsetHeight) - MONTH_HEIGHT
    );
  }, [monthsHeight]);

  const maxTopForMonthRef = useMemo<number>(() => {
    const monthElement = monthsRef.current;
    const wrapperElement = monthsWrapperRef.current;
    if (!monthElement || !wrapperElement) return 0;

    return monthElement.offsetHeight > wrapperElement.offsetHeight
      ? monthElement.offsetHeight - wrapperElement.offsetHeight + redundantSpace
      : 0;
  }, [redundantSpace]);

  const setMonthRefPosition = useCallback(
    (top: number) => {
      const monthElement = monthsRef.current;
      if (!monthElement) return;

      if (top >= 0) {
        monthElement.style.top = '0px';
        return;
      }

      let newPosition: number = top;

      if (Math.abs(top) > maxTopForMonthRef) {
        newPosition = top < 0 ? maxTopForMonthRef * -1 : 0;
      }
      monthElement.style.top = newPosition + 'px';
    },
    [maxTopForMonthRef],
  );

  const setThumbPosition = useCallback(
    (top: number) => {
      if (!thumbRef.current || !monthsRef.current) return;

      let newPosition: number = top;
      directionRef.current = null;

      if (top < 0) {
        newPosition = 0;
        directionRef.current = 'up'; //determine thumb has scroll direction is "up" or "down" or "null"
      } else if (top > maxThumbMovingDistance) {
        newPosition = maxThumbMovingDistance;
        directionRef.current = 'down';
      }
      thumbRef.current.style.top = newPosition + 'px';
    },
    [maxThumbMovingDistance],
  );

  const triggerRef = useRef<{ isPressed: boolean; gap: number }>({
    isPressed: false,
    gap: 0,
  });

  const onMouseMove = useCallback(
    e => {
      if (!triggerRef.current.isPressed) return;

      const parentClientY = e.target.offsetParent.offsetTop;

      const topValue: number =
        e.clientY - parentClientY - triggerRef.current.gap;

      setThumbPosition(topValue);
    },
    [setThumbPosition],
  );

  const handleStopDrag = useCallback(
    e => {
      if (!triggerRef.current.isPressed) {
        return;
      }
      triggerRef.current.isPressed = false;

      const parentClientY = e.target.offsetParent.offsetTop;

      const topValue: number =
        e.clientY - parentClientY - triggerRef.current.gap;

      const monthBlockOrder = Math.floor(
        (topValue + MONTH_HEIGHT / 2) / MONTH_HEIGHT, // consider which month block will take the thumb by calc which block contain more part of thumb
      );

      const top = monthBlockOrder * MONTH_HEIGHT;
      let newPosition = top;

      if (top < 0) {
        newPosition = 0;
      } else if (top > maxThumbMovingDistance) {
        newPosition = maxThumbMovingDistance - redundantSpace;
      }

      setThumbPosition(newPosition);

      const focusMonthBlock =
        months[
          monthBlockOrder +
            Math.abs(getPixelNumber(monthsRef?.current?.style.top)) /
              MONTH_HEIGHT
        ];

      const newQes = qs.stringify({
        ...qsParams,
        createdFrom: focusMonthBlock.createdFrom,
        createdTo: undefined,
      });
      navigate(`${window.location.pathname}?${newQes}`);
    },
    [
      redundantSpace,
      maxThumbMovingDistance,
      months,
      navigate,
      qsParams,
      setThumbPosition,
    ],
  );

  const params = useParams<projectSurveyParams>();

  const previousQueryParam = usePrevious(
    `${qsParams.createdFrom}${params.surveyId}`,
  );

  useEffect(() => {
    //init month and thumb position for the first time render

    if (Object.keys(monthData).length !== months.length) return;
    if (!qsParams.createdFrom) return;

    if (thumbRef.current?.offsetTop) return; // check if thumb was use, then skip init position

    const pos = monthData[qsParams.createdFrom]?.index;

    if (typeof pos !== 'number') return;

    setMonthRefPosition(pos * MONTH_HEIGHT * -1); //complete set month posision

    const NofDisplayMonthsOnWrapper = Math.floor(
      (monthsWrapperRef?.current?.offsetHeight || 0) / MONTH_HEIGHT,
    );

    const gapOfInitMonth = months.length - pos;
    // Need to consider thumb position (default thumb position on top of monthsWrapperRef )

    // If Gap > Number of month displays bar ==> skip set thumb position
    if (gapOfInitMonth > NofDisplayMonthsOnWrapper) return;
    // Else Gap < Number of month displays bar ==> update thumb position
    setThumbPosition(
      (NofDisplayMonthsOnWrapper - gapOfInitMonth) * MONTH_HEIGHT,
    );
  }, [
    monthData,
    months.length,
    params.surveyId,
    previousQueryParam,
    qsParams.createdFrom,
    setMonthRefPosition,
    setThumbPosition,
  ]);

  useEffect(() => {
    // handle scroll month
    const thumbElement = thumbRef.current;

    if (!thumbElement) return;

    let currentIntervalId: NodeJS.Timeout | undefined;

    const start = () => {
      if (currentIntervalId) {
        return;
      }

      if (!triggerRef.current.isPressed || !directionRef.current) {
        return;
      }

      currentIntervalId = setInterval(function () {
        const currentPos = Number(
          monthsRef.current?.style.top.replace('px', ''),
        );

        setMonthRefPosition(
          directionRef.current === 'up'
            ? currentPos + MONTH_HEIGHT
            : currentPos + MONTH_HEIGHT * -1,
        );
      }, 100);
    };

    const stop = () => {
      clearInterval(currentIntervalId);
      currentIntervalId = undefined;
    };

    thumbElement.addEventListener('mousemove', start);
    thumbElement.addEventListener('mouseup', stop);
    thumbElement.addEventListener('mouseleave', stop);

    return () => {
      thumbElement.removeEventListener('mousemove', start);
      thumbElement.removeEventListener('mouseup', stop);
      thumbElement.addEventListener('mouseleave', stop);
    };
  }, [setMonthRefPosition]);

  return (
    <>
      <div
        className={'relative overflow-hidden flex-1 w-[50px]'}
        ref={monthsWrapperRef as unknown as RefObject<HTMLDivElement>}
        style={{
          boxShadow: `inset 0px ${
            getPixelNumber(monthsRef.current?.style.top) >= 0 ? 0 : 20
          }px 8px -10px rgba(0, 0, 0, 0.35), inset 0px ${
            Math.abs(getPixelNumber(monthsRef.current?.style.top)) <
            maxTopForMonthRef
              ? -20
              : 0
          }px 8px -10px rgba(0, 0, 0, 0.35)`,
        }}
      >
        <ThumbWrapper
          onMouseDown={e => {
            e.stopPropagation();
            triggerRef.current.isPressed = true;
            triggerRef.current.gap = e.nativeEvent.offsetY;
          }}
          onMouseUp={handleStopDrag}
          onMouseLeave={handleStopDrag}
          onMouseMove={onMouseMove}
          ref={thumbRef as unknown as RefObject<HTMLDivElement>}
        />

        <div
          className="absolute w-full transition-[top]"
          ref={monthsRef as unknown as RefObject<HTMLDivElement>}
        >
          {months.map((month, index: number) => {
            return (
              <Month
                key={index}
                renderLines={
                  monthData?.[month.createdFrom] &&
                  monthData?.[month.createdFrom].data?.length !== 0
                }
                month={month.monthName}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default memo(Thumb);
