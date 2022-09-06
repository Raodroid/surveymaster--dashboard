import React, { memo, useCallback } from 'react';
import { Slider } from 'antd';

const CusSlider = props => {
  const { onChange } = props;
  const handleOnchange = useCallback(
    (v: number) => {
      if (onChange) {
        onChange(v);
      }
    },
    [onChange],
  );

  return <Slider {...props} onChange={handleOnchange} />;
};

export default memo(CusSlider);
