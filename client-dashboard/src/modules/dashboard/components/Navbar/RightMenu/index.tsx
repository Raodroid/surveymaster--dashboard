import React from 'react';
import { MenuProps } from 'antd';
import { FULL_ROUTE_PATH } from '../../../../../enums';
import BaseMenu from '../BaseMenu';
import CharacterAvatar from '../../../../common/commonComponent/CharacterAvatar';
import styled from 'styled-components';

const AvatarMenuWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const rightNavbarMenu: MenuProps['items'] = [
  {
    label: (
      <AvatarMenuWrapper>
        <CharacterAvatar firstName={'Hannah'} lastName={'lee'} size={'30px'} />{' '}
        Profile
      </AvatarMenuWrapper>
    ),
    key: FULL_ROUTE_PATH.DASHBOARD_PATHS.PROFILE,
  },
];

const MainMenu = () => {
  return <BaseMenu items={rightNavbarMenu} className="right-menu-root" />;
};

export default MainMenu;
