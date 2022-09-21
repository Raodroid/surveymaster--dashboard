import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

function useParseQueryString<S>(): S {
  const location = useLocation();
  return useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }) as S,
    [location.search],
  );
}

export default useParseQueryString;
