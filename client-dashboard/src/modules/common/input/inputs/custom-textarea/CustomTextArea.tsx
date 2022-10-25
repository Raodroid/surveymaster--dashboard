import React, { memo } from 'react';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { OnchangeType } from '../../type';

export type CustomTextAreaProps = TextAreaProps & OnchangeType;
const { TextArea: CustomTextArea } = Input;

const TextArea = (props: CustomTextAreaProps) => {
  const customOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) props.onChange(e.target.value);
  };
  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;
  return <CustomTextArea {...props} {...customProps} />;
};

export default memo(TextArea);
