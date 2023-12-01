import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { ACTIONS_HISTORY_ID } from './index';
import {
  MONTH_HEIGHT,
  projectSurveyParams,
  useGetTimelineActionsHistory,
} from '@pages/Survey';
import { ThumbWrapper } from '../styles';
import { ISurvey } from '@/type';
import Month from '@pages/Survey/DetailSurvey/History/ActionsHistoryCalendar/CalendarScrollbar/Month';

const INPUTS_HEIGHT = 56;
const MIN_ACTIONS_HISTORY_HEIGHT = 478;
const MAX_ACTIONS_HISTORY_HEIGHT = 1200;
const MIN_MONTHS_HEIGHT = MIN_ACTIONS_HISTORY_HEIGHT - INPUTS_HEIGHT;
const MAX_WHEEL_STEP_DISTANCE = 6;
const MAX_ARROW_KEY_STEP_DISTANCE = 4;

enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
}

function Thumb(props: { surveyData: ISurvey }) {
  const { surveyData } = props;
  const params = useParams<projectSurveyParams>();
  const { months, data } = useGetTimelineActionsHistory(
    params.surveyId,
    surveyData?.createdAt as string,
  );
  const mousePos = useRef({ x: 0, y: 0 });
  const [topThumb, setTopThumb] = useState(0);

  // const [monthsWrapper, setMonthsWrapper] = useState<HTMLElement | null>();

  const monthsRef = useRef<HTMLElement>();
  const thumbRef = useRef<HTMLElement>();
  const monthsWrapperRef = useRef<HTMLDivElement>();

  const [monthsHeight, setMonthHeight] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setMonthHeight(
        Math.max(
          MIN_MONTHS_HEIGHT,
          Math.min(
            window.innerHeight - 496,
            MAX_ACTIONS_HISTORY_HEIGHT - INPUTS_HEIGHT,
          ),
        ),
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxScrollDistance = useMemo(() => {
    if (!monthsRef.current) return 0;
    if (monthsRef.current?.offsetHeight >= monthsHeight)
      return monthsHeight - MONTH_HEIGHT;
    return monthsRef.current?.offsetHeight - MONTH_HEIGHT;
  }, [monthsHeight]);

  const [maxInnerDistance, setMaxInnerDistance] = useState<number>(0);

  const setDayAndThumbPosition = useCallback(
    (top: number) => {
      if (!thumbRef.current || !monthsRef.current) return;

      setTopThumb(top);
      thumbRef.current.style.top = top + 'px';
      if (monthsRef.current?.offsetHeight >= monthsHeight) {
        monthsRef.current.style.top =
          -top * (maxInnerDistance / maxScrollDistance) + 'px';
      }
    },
    [maxInnerDistance, maxScrollDistance, monthsHeight],
  );

  const handleScroll = useCallback(
    (e, maxStep: number, direction: string) => {
      if (!thumbRef.current || !monthsRef.current) return;

      if (topThumb <= 0 && direction === DIRECTION.UP) {
        setTopThumb(0);
        thumbRef.current.style.top = '0px';
        monthsRef.current.style.top = '0px';
        return;
      }
      if (topThumb >= maxScrollDistance && direction === DIRECTION.DOWN) {
        setTopThumb(maxScrollDistance);
        thumbRef.current.style.top = maxScrollDistance + 'px';
        if (monthsRef.current.offsetHeight >= monthsHeight)
          monthsRef.current.style.top = -maxInnerDistance + 'px';
        return;
      }

      e.preventDefault();

      const scrollStep =
        (direction === DIRECTION.UP ? -1 : 1) *
        Math.min(
          maxStep,
          maxScrollDistance - topThumb > 0
            ? Math.min(maxScrollDistance - topThumb, maxStep)
            : maxStep,
          topThumb > 0 ? topThumb : maxStep,
        );

      const top = topThumb + scrollStep;
      setDayAndThumbPosition(top);
    },
    [
      topThumb,
      monthsHeight,
      maxInnerDistance,
      maxScrollDistance,
      setDayAndThumbPosition,
    ],
  );

  const handleDragThumb = useCallback(
    element => {
      console.log('hi ');
      if (!element || !monthsRef.current) return;
      let pos1 = 0,
        pos2 = 0;

      const elementDrag = e => {
        if (!monthsRef.current) return;
        e.preventDefault();
        pos1 = pos2 - e.clientY;
        pos2 = e.clientY;

        const top = Math.max(element.offsetTop - pos1, 0);
        const topValue = Math.min(
          top,
          Math.min(monthsHeight, monthsRef.current.offsetHeight) - MONTH_HEIGHT,
        );

        setDayAndThumbPosition(topValue);
      };

      const closeDragThumb = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };

      const dragMouseDown = e => {
        e.preventDefault();
        pos2 = e.clientY;
        document.onmouseup = closeDragThumb;
        document.onmousemove = elementDrag;
      };

      if (document.getElementById(element.id)) {
        document.getElementById(element.id)!.onmousedown = dragMouseDown;
      } else {
        element.onmousedown = dragMouseDown;
      }
    },
    [setDayAndThumbPosition, monthsHeight],
  );

  // handleDragThumb(thumbRef.current);

  useEffect(() => {
    const handleScrollByArrowKey = e => {
      const rects = monthsWrapperRef.current?.getBoundingClientRect();
      if (!monthsRef.current || !rects || !thumbRef.current) return;
      if (e.keyCode !== 38 && e.keyCode !== 40) return;
      if (rects.left > mousePos.current.x || mousePos.current.x > rects.right)
        return;
      if (rects.top > mousePos.current.y || mousePos.current.y > rects.bottom)
        return;

      const direction = e.keyCode === 38 ? DIRECTION.UP : DIRECTION.DOWN;
      handleScroll(e, MAX_ARROW_KEY_STEP_DISTANCE, direction);
    };

    window.addEventListener('keydown', handleScrollByArrowKey);
    return () => {
      window.removeEventListener('keydown', handleScrollByArrowKey);
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleScrollByWheel = e => {
      const isOver = e.path
        ? e.path.some(path => path.id === ACTIONS_HISTORY_ID.MONTHS_WRAPPER)
        : e.target.id === ACTIONS_HISTORY_ID.THUMB;
      if (!isOver || !monthsRef.current || !thumbRef.current) return;

      const direction = e.deltaY < 0 ? DIRECTION.UP : DIRECTION.DOWN;
      handleScroll(e, MAX_WHEEL_STEP_DISTANCE, direction);
    };

    window.addEventListener('wheel', handleScrollByWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleScrollByWheel);
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleMouseMove = e => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (trigger) {
    }
  }, [trigger]);

  useEffect(() => {
    const x = () => {
      setTrigger(true);
    };
    thumbRef.current?.addEventListener('mousedown', x);

    return () => {
      thumbRef.current?.removeEventListener('mousedown', x);
    };
  }, []);

  useEffect(() => {
    const x = () => {
      setTrigger(false);
    };
    thumbRef.current?.addEventListener('mouseup', x);
    return () => {
      thumbRef.current?.removeEventListener('mouseup', x);
    };
  }, []);

  useEffect(() => {
    if (monthsRef.current)
      setMaxInnerDistance(
        monthsRef.current?.offsetHeight >= monthsHeight
          ? monthsRef.current?.offsetHeight - monthsHeight
          : monthsRef.current?.offsetHeight,
      );
  }, [monthsHeight]);

  return (
    <>
      <div
        className={'relative overflow-hidden flex-1 w-[50px]'}
        ref={monthsWrapperRef as unknown as RefObject<HTMLDivElement>}
      >
        <ThumbWrapper ref={thumbRef as unknown as RefObject<HTMLDivElement>} />

        <div
          className="relative"
          ref={monthsRef as unknown as RefObject<HTMLDivElement>}
        >
          {months.map((month, index: number) => {
            return (
              <Month
                key={index}
                renderLines={data?.[index].length !== 0}
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
