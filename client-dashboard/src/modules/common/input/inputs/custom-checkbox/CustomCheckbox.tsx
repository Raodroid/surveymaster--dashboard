import React, { memo } from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { OnchangeType } from '../../type';

export type CustomCheckBoxProps = CheckboxProps & OnchangeType;

const CustomCheckBox = (props: CustomCheckBoxProps) => {
  const customOnChange = e => {
    if (props.onChange) props.onChange(e.target.checked);
  };
  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;
  return <Checkbox {...props} {...customProps} checked={props.value} />;
};
export default memo(CustomCheckBox);
