import React from 'react';
import { MenuProps } from 'antd';
import { FULL_ROUTE_PATH } from '../../../../../enums';
import BaseMenu from '../BaseMenu';

const items: MenuProps['items'] = [
  {
    label: 'Project',
    key: FULL_ROUTE_PATH.DASHBOARD_PATHS.PROJECT,
  },

  {
    label: 'Question Bank',
    key: FULL_ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK,
    // children: [
    //   {
    //     type: 'group',
    //     label: 'Item 1',
    //     children: [
    //       {
    //         label: 'Option 1',
    //         key: 'setting:1',
    //       },
    //       {
    //         label: 'Option 2',
    //         key: 'setting:2',
    //       },
    //     ],
    //   },
    //   {
    //     type: 'group',
    //     label: 'Item 2',
    //     children: [
    //       {
    //         label: 'Option 3',
    //         key: 'setting:3',
    //       },
    //       {
    //         label: 'Option 4',
    //         key: 'setting:4',
    //       },
    //     ],
    //   },
    // ],
  },
];

const MainMenu = () => {
  return <BaseMenu items={items} className="main-menu-root" />;
};

export default MainMenu;
