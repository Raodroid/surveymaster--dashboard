import useParseQueryString from 'hooks/useParseQueryString';
import moment from 'moment';
import qs from 'qs';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDebounce } from 'utils';
import { ACTIONS_HISTORY_ID } from '.';
import { QsParams } from '../../../../ProjectFilter';
import { MONTH_HEIGHT, useGetSurveyDetail } from '../../../utils';
import { ThumbWrapper } from '../styles';

const thumbId = 'actions-history-thumb';

const MAX_MONTHS_HEIGHT = 422;
const MAX_WHEEL_STEP_DISTANCE = 6;
const MAX_ARROW_KEY_STEP_DISTANCE = 2;

enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
}

function Thumb() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const qsParams = useParseQueryString<QsParams>();
  const { survey } = useGetSurveyDetail();

  const [isMounted, setIsMounted] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [topThumb, setTopThumb] = useState(0);

  const [monthsWrapper, setMonthsWrapper] = useState<HTMLElement | null>();
  const [months, setMonths] = useState<HTMLElement | null>();
  const [thumb, setThumb] = useState<HTMLElement | null>();

  const maxScrollDistance = useMemo(() => {
    if (!months) return 0;
    if (months.offsetHeight >= MAX_MONTHS_HEIGHT)
      return MAX_MONTHS_HEIGHT - MONTH_HEIGHT;
    return months.offsetHeight - MONTH_HEIGHT;
  }, [months]);

  const numberOfDaysFromStartOfYear = useMemo(() => {
    if (!survey) return 0;
    return moment('2/9/2021').startOf('month').dayOfYear();
  }, [survey]);

  const numberOfDaysBetweenCreationDateToToday = useMemo(() => {
    if (!survey) return 0;
    const startDay = moment(survey?.data.createdAt).startOf('month');
    return moment().startOf('month').diff(startDay, 'days');
  }, [survey]);

  const [day, setDay] = useState<number>(
    numberOfDaysBetweenCreationDateToToday,
  );
  const debounce = useDebounce(day.toString());
  const [maxInnerDistance, setMaxInnerDistance] = useState<number>(0);

  const calcDay = useCallback(
    (top: number) => {
      if (maxScrollDistance === 0) return;
      const perCent = 1 - top / maxScrollDistance;
      setDay(Math.ceil(perCent * numberOfDaysBetweenCreationDateToToday));
    },
    [numberOfDaysBetweenCreationDateToToday, maxScrollDistance],
  );

  const setDayAndThumbPosition = useCallback(
    (top: number) => {
      if (!thumb || !months) return;
      calcDay(top);
      setTopThumb(top);
      thumb.style.top = top + 'px';
      if (months.offsetHeight >= MAX_MONTHS_HEIGHT) {
        months.style.top = -top * (maxInnerDistance / maxScrollDistance) + 'px';
      }
    },
    [calcDay, maxInnerDistance, maxScrollDistance, months, thumb],
  );

  const handleScroll = useCallback(
    (e, maxStep: number, direction: string) => {
      if (!thumb || !months) return;
      if (topThumb <= 0 && direction === DIRECTION.UP) {
        calcDay(0);
        setTopThumb(0);
        thumb.style.top = '0px';
        months.style.top = '0px';
        return;
      }
      if (topThumb >= maxScrollDistance && direction === DIRECTION.DOWN) {
        calcDay(maxScrollDistance);
        setTopThumb(maxScrollDistance);
        thumb.style.top = maxScrollDistance + 'px';
        if (months.offsetHeight >= MAX_MONTHS_HEIGHT)
          months.style.top = -maxInnerDistance + 'px';
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
      thumb,
      months,
      calcDay,
      topThumb,
      maxInnerDistance,
      maxScrollDistance,
      setDayAndThumbPosition,
    ],
  );

  const handleDragThumb = useCallback(
    element => {
      if (!element || !months) return;
      let pos1 = 0,
        pos2 = 0;

      const elementDrag = e => {
        if (!months) return;
        e.preventDefault();
        pos1 = pos2 - e.clientY;
        pos2 = e.clientY;

        const top = Math.max(element.offsetTop - pos1, 0);
        const topValue = Math.min(
          top,
          Math.min(MAX_MONTHS_HEIGHT, months.offsetHeight) - MONTH_HEIGHT,
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
    [months, setDayAndThumbPosition],
  );
  handleDragThumb(thumb);

  const handleScrollByArrowKey = useCallback(
    e => {
      const rects = monthsWrapper?.getBoundingClientRect();
      if (!months || !rects || !thumb) return;
      if (e.keyCode !== 38 && e.keyCode !== 40) return;
      if (rects.left > mousePos.x || mousePos.x > rects.right) return;
      if (rects.top > mousePos.y || mousePos.y > rects.bottom) return;

      const direction = e.keyCode === 38 ? DIRECTION.UP : DIRECTION.DOWN;
      handleScroll(e, MAX_ARROW_KEY_STEP_DISTANCE, direction);
    },
    [thumb, months, mousePos, monthsWrapper, handleScroll],
  );

  const handleScrollByWheel = useCallback(
    e => {
      const isOver = e.path.some(
        path => path.id === ACTIONS_HISTORY_ID.MONTHS_WRAPPER,
      );
      if (!isOver || !months || !thumb) return;

      const direction = e.deltaY < 0 ? DIRECTION.UP : DIRECTION.DOWN;
      handleScroll(e, MAX_WHEEL_STEP_DISTANCE, direction);
    },
    [months, thumb, handleScroll],
  );

  useEffect(() => {
    const handleMouseMove = e => setMousePos({ x: e.clientX, y: e.clientY });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleScrollByArrowKey);
    document.addEventListener('wheel', handleScrollByWheel, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('wheel', handleScrollByWheel);
      document.removeEventListener('keydown', handleScrollByArrowKey);
    };
  }, [handleScrollByWheel, handleScrollByArrowKey]);

  useEffect(() => {
    if (!thumb) setThumb(document.getElementById(thumbId));
    if (!months) setMonths(document.getElementById(ACTIONS_HISTORY_ID.MONTHS));
    if (months)
      setMaxInnerDistance(
        months.offsetHeight >= MAX_MONTHS_HEIGHT
          ? months.offsetHeight - MAX_MONTHS_HEIGHT
          : months.offsetHeight,
      );
    if (!monthsWrapper)
      setMonthsWrapper(
        document.getElementById(ACTIONS_HISTORY_ID.MONTHS_WRAPPER),
      );
  }, [months, thumb, monthsWrapper]);

  useEffect(() => {
    if (!thumb || !months || !maxInnerDistance || !qsParams) return;
    if (isMounted) return;
    setIsMounted(true);

    const diff = qsParams.createdFrom
      ? moment().startOf('month').diff(moment(qsParams.createdFrom), 'days')
      : 0;

    const perCent = diff / numberOfDaysBetweenCreationDateToToday;
    const top = perCent * maxScrollDistance;

    calcDay(top);
    setTopThumb(top);
    thumb.style.top = top + 'px';
    if (months.offsetHeight >= MAX_MONTHS_HEIGHT) {
      months.style.top = -top * (maxInnerDistance / maxScrollDistance) + 'px';
    }
  }, [
    thumb,
    months,
    calcDay,
    qsParams,
    isMounted,
    maxInnerDistance,
    maxScrollDistance,
    numberOfDaysBetweenCreationDateToToday,
  ]);

  useEffect(() => {
    if (!isMounted) return;
    const params: QsParams = {
      ...qsParams,
      createdFrom: moment(survey?.data.createdAt)
        .dayOfYear(parseInt(debounce) + numberOfDaysFromStartOfYear)
        .startOf('day')
        .format(),
      createdTo: moment(survey?.data.createdAt)
        .dayOfYear(parseInt(debounce) + numberOfDaysFromStartOfYear + 30)
        .endOf('day')
        .format(),
    };

    if (parseInt(debounce) === day) {
      navigate(pathname + '?' + qs.stringify(params), { replace: true });
    }
  }, [debounce]);

  return <ThumbWrapper id={thumbId} />;
}

export default memo(Thumb);
