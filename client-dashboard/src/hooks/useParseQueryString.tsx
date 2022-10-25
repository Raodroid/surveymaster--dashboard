import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

function useParseQueryString<T>(): T {
  const location = useLocation();
  return useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }) as T,
    [location.search],
  );
}

export default useParseQueryString;
