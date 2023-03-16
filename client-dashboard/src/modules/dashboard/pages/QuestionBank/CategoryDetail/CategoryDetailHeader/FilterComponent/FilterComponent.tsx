import styled from 'styled-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import templateVariable from 'app/template-variables.module.scss';

import { ArrowDown, FilterOutlined } from 'icons';
import { FilerDropdown } from './FilterDropDown';

export const FilterComponent = () => {
  const [numOfFilter, setNumOfFilter] = useState(0);
  const { t } = useTranslation();
  return (
    <FilterComponentWrapper>
      <FilterOutlined className={'filter-icon'} />
      <span className={'title'}>{t('common.filters')}</span>
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        overlay={
          <FilerDropdown
            numOfFilter={numOfFilter}
            setNumOfFilter={setNumOfFilter}
          />
        }
      >
        <div className={'filter-main'}>
          <span onClick={e => e.preventDefault()}>
            {numOfFilter}
            <ArrowDown
              style={{
                color: templateVariable.primary_color,
                height: 5,
                marginLeft: 6,
              }}
            />
          </span>
        </div>
      </Dropdown>
    </FilterComponentWrapper>
  );
};
const FilterComponentWrapper = styled.div`
  display: flex;
  padding: 0 10px;
  align-items: center;
  border-radius: 4px;
  background: ${templateVariable.primary_color};
  color: white;
  .filter-icon {
    margin: 0 6px;
  }
  .title {
    font-size: 12px;
  }
  .filter-main {
    cursor: pointer;
    border-radius: 2px;
    background: white;
    color: ${templateVariable.text_primary_color};
    padding: 3px 10px;
    margin: 2px;
    transform: translateX(10px);
    span {
      font-size: 12px;
      font-weight: 600;
    }
  }
`;
