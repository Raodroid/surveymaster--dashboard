import {Input} from 'antd';
import InputMask from 'react-input-mask';
import {InputProps} from 'antd/lib/input';
import {OnchangeType} from '../type';

export type CustomInputMaskProps = InputProps &
  OnchangeType & {
    mask?: string;
    upperCase?: boolean;
  };

export const BaseInputMask = (props: CustomInputMaskProps) => {
  const {
    value,
    onChange,
    onBlur,
    onClick,
    onMouseDown,
    onFocus,
    disabled,
    readOnly,
    mask,
    ...rest
  } = props;

  return (
    <InputMask
      mask={mask}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      maskChar={null}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onFocus={onFocus}
      disabled={disabled}
      readOnly={readOnly}
    >
      {() => <Input {...rest} disabled={disabled} readOnly={readOnly} />}
    </InputMask>
  );
};
