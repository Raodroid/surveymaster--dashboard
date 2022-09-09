import React from 'react';
import { ROUTE_PATH } from '../../../../../enums';
import BaseMenu from '../BaseMenu';

export const mainMenuItem = [
  {
    label: 'Projects',
    key: ROUTE_PATH.DASHBOARD_PATHS.PROJECT,
  },
  {
    label: 'Questions Bank',
    key: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK,
  },
];

const MainMenu = () => {
  return <BaseMenu items={mainMenuItem} className="main-menu-root" />;
};

export default MainMenu;
