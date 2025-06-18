import {Tag} from 'antd';
import {TagProps} from 'antd/lib/tag';
import {FC} from 'react';

interface CustomBtnProps {
  success?: boolean;
  warning?: boolean;
  dark?: boolean;
  danger?: boolean;
  pointer?: boolean;
}

const CustomTag: FC<CustomBtnProps & TagProps> = props => {
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
