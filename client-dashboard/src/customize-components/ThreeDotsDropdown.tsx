import React from 'react';
import { Button, Dropdown } from 'antd';
import { DropDownProps } from 'antd/lib/dropdown';
import { ThreeDotsDropdownWrapper } from './styles';
import { ThreeDotsIcon } from '../icons';

const ThreeDotsDropdown: React.FC<DropDownProps> = props => {
  return (
    <ThreeDotsDropdownWrapper>
      <Dropdown placement="bottomRight" {...props}>
        <Button type={'text'} ghost aria-label={'three drop down'}>
          <ThreeDotsIcon />
        </Button>
      </Dropdown>
    </ThreeDotsDropdownWrapper>
  );
};

export default ThreeDotsDropdown;
