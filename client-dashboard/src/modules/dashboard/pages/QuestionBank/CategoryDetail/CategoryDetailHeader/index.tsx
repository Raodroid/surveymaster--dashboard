import React, { useCallback, useEffect, useState } from 'react';
import { CategoryDetailHeaderWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import { useDebouce } from 'utils';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FilterComponent } from './FilterComponent';

const { Search } = Input;

const CategoryDetailHeader = () => {
  const [searchTxt, setSearchTxt] = useState<string>('');
  const { t } = useTranslation();

  const debouceSearchText = useDebouce(searchTxt);

  const handleTyping = useCallback(e => {
    setSearchTxt(e.target.value);
  }, []);

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
