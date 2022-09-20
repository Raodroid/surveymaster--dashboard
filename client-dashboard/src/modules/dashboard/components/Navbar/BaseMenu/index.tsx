import React, { FC, useEffect, useMemo } from 'react';

import { ConfigProvider, MenuProps } from 'antd';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { DEFAULT_THEME_COLOR } from '../../../../../enums';
import { setSecondaryColor } from '../../../../common/funcs';
import { BaseMenuWrapper } from './style';

const BaseMenu: FC<MenuProps & { callback?: () => void }> = props => {
  const { items, mode, callback, ...rest } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const current = useMemo<string[] | undefined>(() => {
    const key = items?.find(item =>
      matchPath(location.pathname, item?.key as string),
    );

    return key ? [key.key as string] : [];
  }, [items, location.pathname]);

  const onChange: MenuProps['onClick'] = e => {
    if (callback) {
      callback();
    }
    navigate(e.key);
  };

  return (
    <BaseMenuWrapper
      {...rest}
      style={{ background: 'none' }}
      onClick={onChange}
      selectedKeys={current}
      items={items}
      mode={mode || 'horizontal'}
    />
  );
};

export default BaseMenu;
