import {ChangeEvent, memo} from 'react';
import {Input} from 'antd';
import {PasswordProps} from 'antd/lib/input';
import {OnchangeType} from '../../type';

export type CustomPasswordProps = PasswordProps & OnchangeType;
const { Password: CustomPassword } = Input;

const isIOSDevice =
  !!window?.navigator?.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const Password = (props: CustomPasswordProps) => {
  // useEffect(() => {
  //   document.querySelectorAll('.ant-select-selector input').forEach(e => {
  //     e.setAttribute('autocomplete', 'chrome-off');
  //     //you can put any value but NOT "off" or "false" because they DO NOT works
  //   });
  // });

  const customOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(e.target.value);
  };
  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;
  return (
    <CustomPassword
      {...props}
      {...customProps}
      autoComplete="new-password"
      style={{
        fontFamily: isIOSDevice
          ? 'sans-serif'
          : 'DM Sans, Open Sans, sans-serif',
      }}
    />
  );
};

export default memo(Password);
