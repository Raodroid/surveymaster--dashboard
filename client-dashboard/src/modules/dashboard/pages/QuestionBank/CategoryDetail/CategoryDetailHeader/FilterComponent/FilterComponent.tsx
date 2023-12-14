import styled from 'styled-components/macro';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover } from 'antd';
import templateVariable from 'app/template-variables.module.scss';

import { ArrowDown, FilterOutlined } from 'icons';
import { FilerDropdown } from './FilterDropDown';
import { useParseQueryString } from '@/hooks';
import { QsParams, QuestionType } from '@/type';

const CHECKBOX_KEY = {
  filterByCategory: 'filterByCategory',
  filterBySubCategory: 'filterBySubCategory',
  filterByCreatedDate: 'filterByCreatedDate',
  filterByAnswerType: 'filterByAnswerType',
  isDeleted: 'isDeleted',
};

export const FilterComponent = () => {
  const [numOfFilter, setNumOfFilter] = useState(0);
  const { t } = useTranslation();
  const qsParams = useParseQueryString<
    QsParams & {
      types: Array<QuestionType>;
      subCategoryIds: string[];
      categoryIds: string[];
    }
  >();

  useEffect(() => {
    const values = {
      filterByCreatedDate: !!(qsParams.createdFrom || qsParams.createdTo),
      filterByAnswerType: !!qsParams.types,
      filterBySubCategory: !!qsParams.subCategoryIds,
      filterByCategory: !!qsParams.categoryIds,
      isDeleted: qsParams.isDeleted === 'true',
    };
    const filterCount = Object.keys(values).filter(key => {
      const val = values[key];
      return CHECKBOX_KEY[key] && val === true;
    });

    setNumOfFilter(filterCount.length);
  }, [qsParams, setNumOfFilter]);

  return (
    <FilterComponentWrapper>
      <FilterOutlined className={'my-0 mx-[6px]'} />
      <span className={'text-[12px]'}>{t('common.filters')}</span>
      <Popover
        showArrow={false}
        trigger={['click']}
        placement="bottomRight"
        content={<FilerDropdown numOfFilter={numOfFilter} />}
      >
        <div className={'filter-main'}>
          <span>
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
      </Popover>
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

  .filter-main {
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
