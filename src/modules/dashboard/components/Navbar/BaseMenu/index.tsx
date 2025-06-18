import { FC, useMemo } from 'react';

import { MenuProps } from 'antd';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { BaseMenuWrapper } from './style';

const BaseMenu: FC<MenuProps & { callback?: () => void }> = props => {
  const { items, mode, callback, ...rest } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const current = useMemo<string[] | undefined>(() => {
    const key = items?.find(item =>
      matchPath(
        {
          path: item?.key as string,
          caseSensitive: false,
          end: false,
        },
        location.pathname,
      ),
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
