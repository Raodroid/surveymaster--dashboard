import styled from 'styled-components/macro';
import { ROUTE_PATH } from '@/enums';
import CharacterAvatar from '../../../../common/commonComponent/CharacterAvatar';
import BaseMenu from '../BaseMenu';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../../../../../redux/auth';
import { useTranslation } from 'react-i18next';
import PictureAvatar from '../../../../common/commonComponent/PictureAvatar';

const AvatarMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  .avatar-label {
    margin-left: 1rem;
  }
`;

const MainMenu = () => {
  const profile = useSelector(AuthSelectors.getProfile);
  const { t } = useTranslation();
  return (
    <BaseMenu
      items={[
        {
          label: (
            <AvatarMenuWrapper>
              {profile?.avatar ? (
                <PictureAvatar avatarURL={profile.avatar} size={'24px'} />
              ) : (
                <CharacterAvatar
                  firstName={profile?.firstName || ''}
                  lastName={profile?.lastName || ''}
                  size={'30px'}
                />
              )}
              <span className={'avatar-label'}>{t('common.profile')}</span>
            </AvatarMenuWrapper>
          ),
          key: ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT,
        },
      ]}
      className="right-menu-root"
    />
  );
};

export default MainMenu;
