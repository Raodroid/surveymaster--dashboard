import React from 'react';
import { NewItemBtn } from '../styles';
import { ButtonProps } from 'antd/lib/button';
import { PlusIcon } from 'icons';

const PlusComponent: React.FC<ButtonProps> = props => {
  return <NewItemBtn {...props} className="plus-btn" icon={<PlusIcon />} />;
};
export default PlusComponent;
