import React, { Dispatch, FC, useCallback, useEffect, useState } from 'react';
import { CategoryDetailHeaderWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { FilterComponent } from './FilterComponent';

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
        prefix={<SearchOutlined />}
        allowClear
        placeholder={`${t('common.searchQuestion')} ...`}
        value={searchTxt}
        onChange={handleTyping}
      />

      <FilterComponent />
    </CategoryDetailHeaderWrapper>
  );
};

export default CategoryDetailHeader;
