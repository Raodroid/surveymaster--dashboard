import {ChangeEvent, memo} from 'react';
import {Input} from 'antd';
import {InputProps} from 'antd/lib/input';
import {OnchangeType} from '../../type';

export type CustomInputNumberProps = InputProps & OnchangeType;

const CustomInputNumber = (props: CustomInputNumberProps) => {
  const { onChange } = props;
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (
      (!isNaN(Number(value)) && reg.test(value)) ||
      value === '' ||
      value === '-'
    ) {
      if (onChange) {
        onChange(value);
      }
    }
  };
  return (
    <Input {...props} onChange={handleOnChange} autoComplete="chrome-off" />
  );
};

export default memo(CustomInputNumber);
