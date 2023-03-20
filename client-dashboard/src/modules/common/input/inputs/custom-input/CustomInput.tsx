import React, { memo, useEffect } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { OnchangeType } from '../../type';

export type CustomInputProps = InputProps & OnchangeType;

const CustomInput = (props: CustomInputProps) => {
  const customOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(e.target.value);
  };
  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;

  return (
    <Input
      aria-label={'Custom Input'}
      {...props}
      {...customProps}
      autoComplete="chrome-off"
    />
  );
};
export default memo(CustomInput);
