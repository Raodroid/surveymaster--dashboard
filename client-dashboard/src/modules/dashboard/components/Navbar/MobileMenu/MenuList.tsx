import React, { FC } from 'react';
import BaseMenu from '../BaseMenu';
import { mainMenuItem } from '../MainMenu';
import { MenuProps } from 'antd';
import { FULL_ROUTE_PATH } from '../../../../../enums';

const allMenuItems: MenuProps['items'] = [
  ...mainMenuItem,
  {
    label: 'Profile',
    key: FULL_ROUTE_PATH.DASHBOARD_PATHS.PROFILE,
  },
];

interface IMenuList {
  onChangeMenu: () => void;
}

const MenuList: FC<IMenuList> = props => {
  const { onChangeMenu } = props;
  return (
    <BaseMenu
      callback={onChangeMenu}
      items={allMenuItems}
      className="main-menu-root"
      mode={'vertical'}
    />
  );
};

export default MenuList;
