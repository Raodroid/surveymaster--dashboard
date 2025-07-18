import {FunctionComponent, memo, ReactNode, useCallback, useEffect, useMemo, useState,} from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/lib/select';
import styled from 'styled-components/macro';
import {FetchParamsSelect} from 'type';
import {Entities} from '@/enums';
import {CheckboxValueType} from 'antd/lib/checkbox/Group';
import {ArrowDown} from '@/icons';
import templateVariable from '@/app/template-variables.module.scss';
import useFetchFilterOption from '@hoc/useFetchFilterOptions';

export type CustomSelectProps = SelectProps<string | number> & {
  entity?: Entities;
  params?: FetchParamsSelect;
  isLabelDisplayId?: boolean;
  customOptions?: Array<{
    label: ReactNode;
    value: CheckboxValueType;
    conditionCom: JSX.Element;
  }>;
};

const SelectStyled: FunctionComponent<CustomSelectProps> = styled(
  Select,
)<CustomSelectProps>`
  .ant-select-selector {
    padding-right: 30px;
  }
`;

const CustomSelect = (props: CustomSelectProps) => {
  const {
    value,
    entity,
    showSearch,
    isLabelDisplayId,
    params,
    options,
    customOptions,
    ...res
  } = props;
  const [searchValue, setSearchValue] = useState<string>('');

  const queryFetch: FetchParamsSelect = useMemo(() => {
    const newParams: FetchParamsSelect = {
      ...params,
    };
    if (showSearch && searchValue) {
      newParams.q = searchValue;
    }
    return newParams;
  }, [params, searchValue, showSearch]);

  const [fetchedOptions] = useFetchFilterOption(
    !entity
      ? []
      : [
          {
            entity: entity,
            params: queryFetch,
          },
        ],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (props?.onSearch) {
        props.onSearch(value);
      }
    },
    [props],
  );

  const handleClear = () => {
    setSearchValue('');
  };

  useEffect(() => {
    document.querySelectorAll('.ant-select-selector input').forEach(e => {
      e.setAttribute('autocomplete', 'chrome-off');
      //you can put any value but NOT "off" or "false" because they DO NOT works
    });
  });

  const selectProps = useMemo(() => {
    const baseProps: CustomSelectProps & {
      suffixIcon: any;
    } = {
      ...res,
      value: value || undefined,
      showSearch: showSearch,
      onSearch: showSearch ? handleSearch : undefined,
      options: options || fetchedOptions || [],
      onClear: showSearch ? handleClear : undefined,
      suffixIcon: (
        <ArrowDown
          style={{ height: 5, color: templateVariable.primary_color }}
        />
      ),
    };
    if (res.loading) delete baseProps.suffixIcon;

    
    return baseProps;
  }, [res, value, showSearch, handleSearch, options, fetchedOptions]);


  return <SelectStyled {...selectProps} />;
};

export default memo(CustomSelect);
