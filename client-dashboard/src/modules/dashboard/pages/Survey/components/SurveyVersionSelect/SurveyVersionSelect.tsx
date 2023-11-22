import React, { FC, useCallback } from 'react';
import { RoundedSelect } from '@/customize-components';
import { SelectProps } from 'antd/lib/select';
import { useNavigate } from 'react-router';
import qs from 'qs';
import { useParseQueryString } from '@/hooks';
import { IGetParams } from '@/type';

const SurveyVersionSelect: FC<{
  options: SelectProps['options'];
  value: SelectProps['value'];
}> = props => {
  const { options, value } = props;
  const qsParams = useParseQueryString<IGetParams & { version?: string }>();
  const navigate = useNavigate();

  const changeVersion = useCallback(
    (version, options) => {
      const newQes = qs.stringify({
        ...qsParams,
        version: options.label,
      });
      navigate(`${window.location.pathname}?${newQes}`);
    },
    [navigate, qsParams],
  );
  return (
    <RoundedSelect
      value={value}
      options={options}
      className={'w-[200px]'}
      onChange={changeVersion}
    />
  );
};

export default SurveyVersionSelect;
