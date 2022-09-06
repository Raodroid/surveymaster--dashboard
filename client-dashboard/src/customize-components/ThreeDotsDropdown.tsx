import React from 'react';
import { Dropdown } from 'antd';
import { DropDownProps } from 'antd/lib/dropdown';
import { ThreeDotsDropdownWrapper } from './styles';
import { ThreeDotsIcon } from '../icons';

const ThreeDotsIconStyled = (
  <div className="three-dots">
    <div className="dots-container">
      <ThreeDotsIcon />
    </div>
  </div>
);

const ThreeDotsDropdown: React.FC<DropDownProps> = props => {
  return (
    <ThreeDotsDropdownWrapper>
      <Dropdown {...props} placement="bottomRight" arrow>
        {ThreeDotsIconStyled}
      </Dropdown>
    </ThreeDotsDropdownWrapper>
  );
};

export default ThreeDotsDropdown;
