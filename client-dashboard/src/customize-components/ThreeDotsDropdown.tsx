import React from 'react';
import { Dropdown } from 'antd';
import { DropDownProps } from 'antd/lib/dropdown';
import { ThreeDotsDropdownWrapper } from './styles';
import { ThreeDotsIcon } from '../icons';

const ThreeDotsDropdown: React.FC<DropDownProps> = props => {
  return (
    <ThreeDotsDropdownWrapper>
      <Dropdown placement="bottomRight" {...props}>
        <div
          className="three-dots"
          onClick={e => {
            e.preventDefault();
          }}
        >
          <div className="dots-container">
            <ThreeDotsIcon />
          </div>
        </div>
      </Dropdown>
    </ThreeDotsDropdownWrapper>
  );
};

export default ThreeDotsDropdown;
