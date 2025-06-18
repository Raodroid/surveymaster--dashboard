import {ChangeEvent, memo} from 'react';
import {BaseInputMask, CustomInputMaskProps,} from '../../input-mask/BaseInputMask';

const CustomInputMask = (props: CustomInputMaskProps) => {
  const { upperCase, ...rest } = props;
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

  return <BaseInputMask {...rest} {...customProps} />;
};
export default memo(CustomInputMask);
