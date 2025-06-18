import qs from 'qs';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParseQueryString } from './useParseQueryString';
import { QsParams } from '@/type';

export const useHandleNavigate = (initParams?: Record<string, any>) => {
  const qsParams = useParseQueryString<QsParams>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (props: QsParams) => {
      const {
        q = qsParams.q || initParams?.q || '',
        page = qsParams.page || initParams?.page || 1,
        take = qsParams.take || initParams?.take || 10,
        isDeleted = qsParams.isDeleted === 'true',
      } = props;
      const newParams = {
        ...qsParams,
        q,
        page,
        take,
        isDeleted,
      };
      navigate(pathname + '?' + qs.stringify(newParams), { replace: true });
    },
    [navigate, pathname, qsParams, initParams],
  );
  return handleNavigate;
};
