import { PROFILE_TAB, ROUTE_PATH } from 'enums';
import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { TeamContent, UserContent } from './content';
import Sider from './sider';
import { ProfileStyled } from './styles';

const Profile = () => {
  const path = useLocation();

  const tab = useMemo(() => {
    return path.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT
      ? PROFILE_TAB.USER
      : PROFILE_TAB.TEAM;
  }, [path.pathname]);

  return (
    <ProfileStyled>
      <div className="layout flex">
        <Sider tab={tab} />
        {tab === 'user' ? <UserContent /> : <TeamContent />}
      </div>
    </ProfileStyled>
  );
};

export default Profile;
