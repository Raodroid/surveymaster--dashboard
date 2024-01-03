import {ChangeEvent, memo} from 'react';
import {Input} from 'antd';
import {BaseInputMask, CustomInputMaskProps,} from '../../input-mask/BaseInputMask';

const CustomInputGroupMask = (props: CustomInputMaskProps) => {
  const { suffix, prefix, upperCase, ...rest } = props;
  const customOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      if (upperCase) {
        props.onChange(e.target.value.toUpperCase());
      } else {
        props.onChange(e.target.value);
      }
    }
  };
  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;

  return (
    <Input.Group compact={true}>
      {prefix}
      <BaseInputMask {...rest} {...customProps} />
      {suffix}
    </Input.Group>
  );
};
export default memo(CustomInputGroupMask);
