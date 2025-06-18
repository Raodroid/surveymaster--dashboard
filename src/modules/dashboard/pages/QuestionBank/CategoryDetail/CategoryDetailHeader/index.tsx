import { memo, useCallback, useEffect, useState } from 'react';
import { CategoryDetailHeaderWrapper } from './style';
import { useTranslation } from 'react-i18next';

import { FilterComponent } from './FilterComponent/FilterComponent';
import Search from 'antd/es/input/Search';
import { useNavigate } from 'react-router-dom';
import { useParseQueryString } from '@/hooks';
import { IGetParams } from '@/type';
import qs from 'qs';

const CategoryDetailHeader = () => {
  const [searchTxt, setSearchTxt] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const qsParams = useParseQueryString<IGetParams>();

  const handleSearch = useCallback(
    (e: string) => {
      navigate(
        window.location.pathname +
          '?' +
          qs.stringify({
            ...qsParams,
            q: e,
          }),
        { replace: true },
      );
    },
    [navigate, qsParams],
  );

  useEffect(() => {
    if (qsParams.q) {
      setSearchTxt(qsParams.q);
    }
  }, [qsParams]);

  return (
    <CategoryDetailHeaderWrapper>
      <Search
        onSearch={handleSearch}
        allowClear
        placeholder={`${t('common.searchQuestion')} ...`}
        value={searchTxt}
        onChange={e => {
          setSearchTxt(e.target.value);
        }}
        aria-label={'search-input'}
      />

      <FilterComponent />
    </CategoryDetailHeaderWrapper>
  );
};

export default memo(CategoryDetailHeader);
