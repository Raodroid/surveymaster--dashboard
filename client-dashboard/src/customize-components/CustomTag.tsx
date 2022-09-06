import React from 'react';
import { Tag } from 'antd';
import { TagProps } from 'antd/lib/tag';

interface CustomBtnProps {
  success?: boolean;
  warning?: boolean;
  dark?: boolean;
  danger?: boolean;
  pointer?: boolean;
}

const CustomTag: React.FC<CustomBtnProps & TagProps> = props => {
  const { success, warning, dark, danger, pointer, ...res } = props;
  const className = `${pointer ? 'ant-tag-pointer' : ''} ${
    success
      ? 'ant-tag-success'
      : warning
      ? 'ant-tag-warning'
      : dark
      ? 'ant-tag-dark'
      : danger
      ? 'ant-tag-danger'
      : ''
  }`;
  return <Tag {...res} className={className} />;
};

export default CustomTag;
