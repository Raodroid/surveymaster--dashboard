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
import Month from '@pages/Survey/DetailSurvey/History/ActionsHistoryCalendar/CalendarScrollbar/Month';
import { useNavigate } from 'react-router-dom';
import { useParseQueryString } from '@/hooks';
import qs from 'qs';
import { useActionHistoryContext } from '@pages/Survey/DetailSurvey/History/ActionsHistoryCalendar/ActionHistoryContext/useActionHistoryContext';
import { usePrevious } from '@/utils';
import { useParams } from 'react-router';

export const MONTH_HEIGHT = 124;

const INPUTS_HEIGHT = 56;
const MIN_ACTIONS_HISTORY_HEIGHT = 478;
const MAX_ACTIONS_HISTORY_HEIGHT = 1200;
const MIN_MONTHS_HEIGHT = MIN_ACTIONS_HISTORY_HEIGHT - INPUTS_HEIGHT;
const MAX_WHEEL_STEP_DISTANCE = 100;
const MAX_ARROW_KEY_STEP_DISTANCE = 4;

enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
}

function Thumb() {
  const { months, monthData } = useActionHistoryContext();
  const mousePos = useRef({ x: 0, y: 0 });

  const monthsRef = useRef<HTMLElement>();
  const thumbRef = useRef<HTMLElement>();
  const monthsWrapperRef = useRef<HTMLDivElement>();

  const [monthsHeight, setMonthHeight] = useState<number>(0);

  const directionRef = useRef<'up' | 'down' | null>(null);

  useEffect(() => {
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

  const maxDistance = useMemo<number>(() => {
    if (!thumbRef.current || !monthsRef.current) return 0;

    return (
      (monthsHeight < monthsRef.current?.offsetHeight
        ? monthsHeight
        : monthsRef.current?.offsetHeight) - MONTH_HEIGHT
    );
  }, [monthsHeight]);

  const setMonthRefPosition = useCallback((top: number) => {
    const monthElement = monthsRef.current;
    const wrapperElement = monthsWrapperRef.current;
    if (!monthElement || !wrapperElement) return;

    let newPosition: number = top;

    const maxTop: number =
      monthElement.offsetHeight > wrapperElement.offsetHeight
        ? monthElement.offsetHeight - wrapperElement.offsetHeight
        : 0;

    if (top < 0) {
      newPosition = 0;
    } else if (top > maxTop) {
      newPosition = maxTop;
    }
    monthElement.style.top = newPosition * -1 + 'px';
  }, []);

  const setThumbPosition = useCallback(
    (top: number) => {
      if (!thumbRef.current || !monthsRef.current) return;

      let newPosition: number = top;

      if (top < 0) {
        newPosition = 0;
      } else if (top > maxDistance) {
        newPosition = maxDistance;
      }
      thumbRef.current.style.top = newPosition + 'px';

      // if (monthsRef.current?.offsetHeight >= monthsHeight) {
      //   monthsRef.current.style.top =
      //     -top * (maxInnerDistance / maxScrollDistance) + 'px';
      // }
    },
    [maxDistance],
  );

  // const handleScroll = useCallback(
  //   (e, maxStep: number, direction: string) => {
  //     if (!thumbRef.current || !monthsRef.current) return;
  //
  //     if (topThumb <= 0 && direction === DIRECTION.UP) {
  //       setTopThumb(0);
  //       thumbRef.current.style.top = '0px';
  //       monthsRef.current.style.top = '0px';
  //       return;
  //     }
  //     if (topThumb >= maxScrollDistance && direction === DIRECTION.DOWN) {
  //       setTopThumb(maxScrollDistance);
  //       thumbRef.current.style.top = maxScrollDistance + 'px';
  //       if (monthsRef.current.offsetHeight >= monthsHeight)
  //         monthsRef.current.style.top = -maxInnerDistance + 'px';
  //       return;
  //     }
  //
  //     e.preventDefault();
  //
  //     const scrollStep =
  //       (direction === DIRECTION.UP ? -1 : 1) *
  //       Math.min(
  //         maxStep,
  //         maxScrollDistance - topThumb > 0
  //           ? Math.min(maxScrollDistance - topThumb, maxStep)
  //           : maxStep,
  //         topThumb > 0 ? topThumb : maxStep,
  //       );
  //
  //     const top = topThumb + scrollStep;
  //     setThumbPosition(top);
  //   },
  //   [
  //     topThumb,
  //     monthsHeight,
  //     maxInnerDistance,
  //     maxScrollDistance,
  //     setThumbPosition,
  //   ],
  // );

  const triggerRef = useRef<{ thumb: boolean; pos: number; gap: number }>({
    thumb: false,
    pos: 0,
    gap: 0,
  });

  const onMouseMove = useCallback(
    e => {
      if (!monthsRef.current || !triggerRef.current.thumb) return;

      const parentClientY = e.target.offsetParent.offsetTop;

      const topValue: number =
        e.clientY - parentClientY - triggerRef.current.gap;

      directionRef.current = null;

      setThumbPosition(topValue);
    },
    [setThumbPosition],
  );
  const navigate = useNavigate();

  const qsParams = useParseQueryString<IGetParams>();

  const handleStopDrag = useCallback(
    e => {
      if (!triggerRef.current.thumb) {
        return;
      }
      triggerRef.current.thumb = false;

      const parentClientY = e.target.offsetParent.offsetTop;

      const topValue: number =
        e.clientY - parentClientY - triggerRef.current.gap;

      const monthBlockOrder = Math.floor(
        (topValue + MONTH_HEIGHT / 2) / MONTH_HEIGHT,
      );

      setThumbPosition(monthBlockOrder * MONTH_HEIGHT);

      const focusMonthBlock = months[monthBlockOrder];

      const newQes = qs.stringify({
        ...qsParams,
        createdFrom: focusMonthBlock.createdFrom,
        createdTo: undefined,
      });
      navigate(`${window.location.pathname}?${newQes}`);

      // if (topValue < 0) {
      //   directionRef.current = 'up';
      // } else if (topValue >= maxDistance) {
      //   directionRef.current = 'down';
      // }
    },
    [months, navigate, qsParams, setThumbPosition],
  );

  const handleWheel = useCallback(e => {
    // const isOver = e.path
    //   ? e.path.some(
    //       path => path.id === ACTIONS_HISTORY_ID.MONTHS_WRAPPER,
    //     )
    //   : e.target.id === ACTIONS_HISTORY_ID.THUMB;
    // if (!isOver || !monthsRef.current || !thumbRef.current) return;

    const direction = e.deltaY < 0 ? DIRECTION.UP : DIRECTION.DOWN;
    // handleScroll(e, MAX_WHEEL_STEP_DISTANCE, direction);
  }, []);

  // useEffect(() => {
  //   const handleScrollByArrowKey = e => {
  //     const rects = monthsWrapperRef.current?.getBoundingClientRect();
  //     if (!monthsRef.current || !rects || !thumbRef.current) return;
  //     if (e.keyCode !== 38 && e.keyCode !== 40) return;
  //     if (rects.left > mousePos.current.x || mousePos.current.x > rects.right)
  //       return;
  //     if (rects.top > mousePos.current.y || mousePos.current.y > rects.bottom)
  //       return;
  //
  //     const direction = e.keyCode === 38 ? DIRECTION.UP : DIRECTION.DOWN;
  //     handleScroll(e, MAX_ARROW_KEY_STEP_DISTANCE, direction);
  //   };
  //
  //   window.addEventListener('keydown', handleScrollByArrowKey);
  //   return () => {
  //     window.removeEventListener('keydown', handleScrollByArrowKey);
  //   };
  // }, [handleScroll]);

  // useEffect(() => {
  //   const handleScrollByWheel = e => {
  //     const isOver = e.path
  //       ? e.path.some(path => path.id === ACTIONS_HISTORY_ID.MONTHS_WRAPPER)
  //       : e.target.id === ACTIONS_HISTORY_ID.THUMB;
  //     if (!isOver || !monthsRef.current || !thumbRef.current) return;
  //
  //     const direction = e.deltaY < 0 ? DIRECTION.UP : DIRECTION.DOWN;
  //     handleScroll(e, MAX_WHEEL_STEP_DISTANCE, direction);
  //   };
  //
  //   window.addEventListener('wheel', handleScrollByWheel, { passive: false });
  //   return () => {
  //     window.removeEventListener('keydown', handleScrollByWheel);
  //   };
  // }, [handleScroll]);

  const params = useParams<projectSurveyParams>();

  const previousQueryParam = usePrevious(
    `${qsParams.createdFrom}${params.surveyId}`,
  );

  // useEffect(() => {
  //   if (!monthsRef.current || !qsParams?.createdFrom) return;
  //   if (Object.keys(monthData).length !== months.length) return;
  //   if (directionRef.current) return;
  //   console.log('call');
  //
  //   const pos = monthData[qsParams.createdFrom]?.index;
  //
  //   if (typeof pos !== 'number') return;
  //
  //   setMonthRefPosition(pos * MONTH_HEIGHT);
  //
  //   // monthsRef.current?.scrollTo({ top: pos * 124, behavior: 'smooth' });
  //   // setThumbPosition(monthData[qsParams.createdFrom].index + 1);
  // }, [
  //   monthData,
  //   months.length,
  //   params.surveyId,
  //   previousQueryParam,
  //   qsParams.createdFrom,
  //   setMonthRefPosition,
  //   setThumbPosition,
  // ]);

  useEffect(() => {
    const thumbElement = thumbRef.current;
    console.log(directionRef.current);

    if (!thumbElement || !directionRef.current) return;

    let change;

    const start = () => {
      change = setInterval(function () {
        console.log('scroll');
        setMonthRefPosition(
          directionRef.current === 'up'
            ? MAX_WHEEL_STEP_DISTANCE
            : MAX_WHEEL_STEP_DISTANCE * -1,
        );
      }, 400);
    };

    const stop = () => {
      console.log('stop');
      if (change) clearInterval(change);
    };

    thumbElement.addEventListener('mousedown', start);
    thumbElement.addEventListener('mouseup', stop);

    return () => {
      thumbElement.removeEventListener('mousedown', start);
      thumbElement.removeEventListener('mouseup', stop);
    };
  }, [setMonthRefPosition]);

  return (
    <>
      <div
        className={'relative overflow-hidden flex-1 w-[50px]'}
        ref={monthsWrapperRef as unknown as RefObject<HTMLDivElement>}
      >
        <ThumbWrapper
          onMouseDown={e => {
            e.stopPropagation();
            triggerRef.current.thumb = true;
            triggerRef.current.pos = e.clientY;
            triggerRef.current.gap = e.nativeEvent.offsetY;
          }}
          onMouseUp={handleStopDrag}
          onMouseLeave={handleStopDrag}
          onMouseMove={onMouseMove}
          ref={thumbRef as unknown as RefObject<HTMLDivElement>}
        />

        <div
          className="absolute w-full transition-[top]"
          onWheel={handleWheel}
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
