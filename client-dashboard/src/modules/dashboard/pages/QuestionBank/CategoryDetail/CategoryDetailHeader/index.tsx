import React, { Dispatch, FC, useCallback } from 'react';
import { CategoryDetailHeaderWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';

import { FilterComponent } from './FilterComponent/FilterComponent';
import { SearchIcon } from '../../../../../../icons/SearchIcon';

interface ICategoryDetailHeader {
  searchTxt: string;
  setSearchTxt: Dispatch<string>;
}

const CategoryDetailHeader: FC<ICategoryDetailHeader> = props => {
  const { searchTxt, setSearchTxt } = props;
  const { t } = useTranslation();

  const handleTyping = useCallback(
    e => {
      setSearchTxt(e.target.value);
    },
    [setSearchTxt],
  );

  return (
    <CategoryDetailHeaderWrapper>
      <Input
        className={'search-input'}
        prefix={<SearchIcon />}
        allowClear
        placeholder={`${t('common.searchQuestion')} ...`}
        value={searchTxt}
        onChange={handleTyping}
        aria-label={'search-input'}
      />

      <FilterComponent />
    </CategoryDetailHeaderWrapper>
  );
};

export default CategoryDetailHeader;
