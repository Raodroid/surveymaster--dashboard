import { useMemo } from 'react';
import { ROUTE_PATH , SCOPE_CONFIG} from '@/enums';
import BaseMenu from '../BaseMenu';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useCheckScopeEntityDefault } from '@/modules/common';
import { Clock, DiagramIcon, QuestionTypeIcon } from '@/icons';

export const mainMenuItem = [
  {
    label: 'Projects',
    key: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
    icon: <DiagramIcon />,
  },
  {
    label: 'Question Bank',
    key: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT,
    icon: <QuestionTypeIcon />,
  },
  {
    label: 'Change log',
    key: ROUTE_PATH.DASHBOARD_PATHS.CHANGE_LOG.ROOT,
    icon: <Clock />,
  },
];

const MainMenu = () => {
  const { canRead: canReadQuestion } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTION,
  );

  const { canRead: canReadProject } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.PROJECT,
  );
  const menuItems = useMemo<ItemType[]>(() => {
    const result: ItemType[] = [];
    if (canReadProject) {
      result.push(mainMenuItem[0]);
    }
    if (canReadQuestion) {
      result.push(mainMenuItem[1]);
    }
    result.push(mainMenuItem[2]);
    return result;
  }, [canReadProject, canReadQuestion]);

  return <BaseMenu items={menuItems} className="flex-1" />;
};

export default MainMenu;
