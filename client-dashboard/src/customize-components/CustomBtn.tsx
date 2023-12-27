import {Button} from 'antd';
import {ButtonProps} from 'antd/lib/button';
import {FC} from 'react';

interface CustomBtnProps {
  success?: boolean;
  warning?: boolean;
  dark?: boolean;
}

const CustomBtn: FC<CustomBtnProps & ButtonProps> = props => {
  const { className, success, warning, dark, ...res } = props;
  const addClassName = `${
    success
      ? 'ant-btn-success'
      : warning
      ? 'ant-btn-warning'
      : dark
      ? 'ant-btn-dark'
      : ''
  }`;
  return (
    <Button
      {...res}
      className={`${className} ${addClassName} centralize`}
      aria-label="Custom Button"
    />
  );
};

export default CustomBtn;
