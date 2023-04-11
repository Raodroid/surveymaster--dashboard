import { useParseQueryString } from 'hooks/useParseQueryString';
import moment from 'moment';
import qs from 'qs';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDebounce } from 'utils';
import { ACTIONS_HISTORY_ID } from '.';
import { QsParams } from '../../../../project-filter/ProjectFilter';
import { MONTH_HEIGHT } from '../../../utils';
import { ThumbWrapper } from '../styles';
import { useGetSurveyById } from '../../../../Survey/util';
import { projectSurveyParams } from '../../../index';

const thumbId = 'actions-history-thumb';

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

function Thumb() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const qsParams = useParseQueryString<QsParams>();
  const params = useParams<projectSurveyParams>();
  const { surveyData } = useGetSurveyById(params.surveyId);

  const [isMounted, setIsMounted] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const [topThumb, setTopThumb] = useState(0);

  const [monthsWrapper, setMonthsWrapper] = useState<HTMLElement | null>();
  const [months, setMonths] = useState<HTMLElement | null>();
  const [thumb, setThumb] = useState<HTMLElement | null>();

  const monthsHeight = useMemo(() => {
    return Math.max(
      MIN_MONTHS_HEIGHT,
      Math.min(
        window.innerHeight - 496,
        MAX_ACTIONS_HISTORY_HEIGHT - INPUTS_HEIGHT,
      ),
    );
  }, [window.innerHeight]);

  const maxScrollDistance = useMemo(() => {
    if (!months) return 0;
    if (months.offsetHeight >= monthsHeight) return monthsHeight - MONTH_HEIGHT;
    return months.offsetHeight - MONTH_HEIGHT;
  }, [months, monthsHeight]);

  const numberOfDaysFromStartOfYear = useMemo(() => {
    if (!surveyData) return 0;
    return moment(surveyData.createdAt).startOf('month').dayOfYear();
  }, [surveyData]);

  const numberOfDaysBetweenCreationDateToToday = useMemo(() => {
    if (!surveyData) return 0;
    const startDay = moment(surveyData.createdAt).startOf('month');
    return moment().startOf('month').diff(startDay, 'days');
  }, [surveyData]);

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
      if (months.offsetHeight >= monthsHeight) {
        months.style.top = -top * (maxInnerDistance / maxScrollDistance) + 'px';
      }
    },
    [calcDay, maxInnerDistance, maxScrollDistance, months, thumb, monthsHeight],
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
        if (months.offsetHeight >= monthsHeight)
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
      monthsHeight,
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
          Math.min(monthsHeight, months.offsetHeight) - MONTH_HEIGHT,
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
    [months, setDayAndThumbPosition, monthsHeight],
  );
  handleDragThumb(thumb);

  const handleScrollByArrowKey = useCallback(
    e => {
      const rects = monthsWrapper?.getBoundingClientRect();
      if (!months || !rects || !thumb) return;
      if (e.keyCode !== 38 && e.keyCode !== 40) return;
      if (rects.left > mousePos.current.x || mousePos.current.x > rects.right)
        return;
      if (rects.top > mousePos.current.y || mousePos.current.y > rects.bottom)
        return;

      const direction = e.keyCode === 38 ? DIRECTION.UP : DIRECTION.DOWN;
      handleScroll(e, MAX_ARROW_KEY_STEP_DISTANCE, direction);
    },
    [thumb, months, monthsWrapper, handleScroll],
  );

  const handleScrollByWheel = useCallback(
    e => {
      const isOver = e.path
        ? e.path.some(path => path.id === ACTIONS_HISTORY_ID.MONTHS_WRAPPER)
        : e.target.id === ACTIONS_HISTORY_ID.THUMB;
      if (!isOver || !months || !thumb) return;

      const direction = e.deltaY < 0 ? DIRECTION.UP : DIRECTION.DOWN;
      handleScroll(e, MAX_WHEEL_STEP_DISTANCE, direction);
    },
    [months, thumb, handleScroll],
  );

  useEffect(() => {
    const handleMouseMove = e =>
      (mousePos.current = { x: e.clientX, y: e.clientY });

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
        months.offsetHeight >= monthsHeight
          ? months.offsetHeight - monthsHeight
          : months.offsetHeight,
      );
    if (!monthsWrapper)
      setMonthsWrapper(
        document.getElementById(ACTIONS_HISTORY_ID.MONTHS_WRAPPER),
      );
  }, [months, thumb, monthsWrapper, monthsHeight]);

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
    if (months.offsetHeight >= monthsHeight) {
      months.style.top = -top * (maxInnerDistance / maxScrollDistance) + 'px';
    }
  }, [
    thumb,
    months,
    calcDay,
    qsParams,
    isMounted,
    monthsHeight,
    maxInnerDistance,
    maxScrollDistance,
    numberOfDaysBetweenCreationDateToToday,
  ]);

  useEffect(() => {
    if (!isMounted) return;
    const params: QsParams = {
      ...qsParams,
      createdFrom: moment(surveyData.createdAt)
        .dayOfYear(parseInt(debounce) + numberOfDaysFromStartOfYear)
        .startOf('day')
        .format(),
      createdTo: moment(surveyData.createdAt)
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
