import React, { useMemo } from 'react';
import { ROUTE_PATH } from '../../../../../enums';
import BaseMenu from '../BaseMenu';
import { SCOPE_CONFIG } from '../../../../../enums/user';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useCheckScopeEntityDefault } from '../../../../common/hoc';

export const mainMenuItem = [
  {
    label: 'Projects',
    key: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
  },
  {
    label: 'Questions Bank',
    key: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT,
  },
];

const MainMenu = () => {
  const { canRead: canReadQuestion } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTIONS,
  );
  const { canRead: canReadProject } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.PROJECTS,
  );
  const menuItems = useMemo<ItemType[]>(() => {
    const result: ItemType[] = [];
    if (canReadProject) {
      result.push({
        label: 'Projects',
        key: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
      });
    }
    if (canReadQuestion) {
      result.push({
        label: 'Questions Bank',
        key: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT,
      });
    }
    return result;
  }, [canReadProject, canReadQuestion]);

  return <BaseMenu items={menuItems} className="main-menu-root" />;
};

export default MainMenu;
