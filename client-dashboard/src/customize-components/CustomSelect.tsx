import React, { useEffect } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';

interface CustomInputProps {
  success?: boolean;
  error?: boolean;
  inverted?: boolean;
}

const CustomSelect: React.FC<CustomInputProps & SelectProps<any>> = props => {
  const { success, error, inverted, className, ...res } = props;
  const finalClassName = `${success ? 'ant-select-affix-wrapper-success' : ''}
    ${error ? 'ant-select-affix-wrapper-error' : ''}
    ${className || ''}
  ${inverted ? 'ant-select-affix-wrapper-inverted' : ''}`;

  useEffect(() => {
    document.querySelectorAll('.ant-select-selector input').forEach(e => {
      e.setAttribute('autocomplete', 'chrome-off');
      //you can put any value but NOT "off" or "false" because they DO NOT works
    });
  });

  return <Select {...res} className={finalClassName} />;
};

export default CustomSelect;
