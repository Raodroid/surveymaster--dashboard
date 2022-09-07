import React, { FC, useMemo } from 'react';
import { Menu, MenuProps } from 'antd';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';

const BaseMenu: FC<MenuProps> = props => {
  const { items, ...rest } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const current = useMemo<string[] | undefined>(() => {
    const key = items?.find(item =>
      matchPath(location.pathname, item?.key as string),
    );

    return key ? [key.key as string] : undefined;
  }, [items, location.pathname]);

  const onChange: MenuProps['onClick'] = e => {
    navigate(e.key);
  };

  return (
    <Menu
      style={{ background: 'none' }}
      onClick={onChange}
      selectedKeys={current}
      className={'main-menu-root'}
      mode="horizontal"
      items={items}
      theme={'light'}
      {...rest}
    />
  );
};

export default BaseMenu;
