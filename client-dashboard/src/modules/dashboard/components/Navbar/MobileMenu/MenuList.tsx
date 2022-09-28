import React, { FC } from 'react';
import BaseMenu from '../BaseMenu';
import { mainMenuItem } from '../MainMenu';
import { MenuProps } from 'antd';
import { ROUTE_PATH } from '../../../../../enums';

const allMenuItems: MenuProps['items'] = [
  ...mainMenuItem,
  {
    label: 'Profile',
    key: ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT,
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
