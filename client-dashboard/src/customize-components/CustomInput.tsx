import React, { useMemo } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { ColorOutlined, BoxIconOutlined } from 'icons';

interface CustomInputProps {
  success?: boolean;
  error?: boolean;
  inverted?: boolean;
}

const suffix = type => {
  switch (type) {
    case 'success':
      return (
        <ColorOutlined
          style={{
            color: '#0C9F6A',
            width: 20,
            height: 20,
          }}
        />
      );
    case 'error':
      return (
        <BoxIconOutlined
          style={{
            color: '#F32A3D',
            width: 16.67,
            height: 16.67,
          }}
        />
      );
    default:
      return null;
  }
};

const CustomInput: React.FC<CustomInputProps & InputProps> = props => {
  const { success, error, inverted, ...res } = props;
  const className = `${success ? 'ant-input-affix-wrapper-success' : ''}
    ${error ? 'ant-input-affix-wrapper-error' : ''}
  ${inverted ? 'ant-input-affix-wrapper-inverted' : ''}`;

  const isHasSuffix = useMemo(() => {
    if (success) return 'success';
    if (error) return 'error';
    return false;
  }, [success, error]);

  return (
    <Input
      {...res}
      className={className}
      suffix={isHasSuffix && suffix(isHasSuffix)}
      autoComplete="chrome-off"
      aria-label="Custom Input"
    />
  );
};

export default CustomInput;
