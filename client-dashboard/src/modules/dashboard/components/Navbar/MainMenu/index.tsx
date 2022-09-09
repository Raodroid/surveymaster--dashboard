import React from 'react';
import { FULL_ROUTE_PATH } from '../../../../../enums';
import BaseMenu from '../BaseMenu';

export const mainMenuItem = [
  {
    label: 'Projects',
    key: FULL_ROUTE_PATH.DASHBOARD_PATHS.PROJECT,
  },
  {
    label: 'Questions Bank',
    key: FULL_ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK,
  },
];

const MainMenu = () => {
  return <BaseMenu items={mainMenuItem} className="main-menu-root" />;
};

export default MainMenu;
