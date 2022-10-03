import { MenuProps } from 'antd';
import styled from 'styled-components';
import { ROUTE_PATH } from '../../../../../enums';
import CharacterAvatar from '../../../../common/commonComponent/CharacterAvatar';
import BaseMenu from '../BaseMenu';

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
    key: ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT,
  },
];

const MainMenu = () => {
  return <BaseMenu items={rightNavbarMenu} className="right-menu-root" />;
};

export default MainMenu;
