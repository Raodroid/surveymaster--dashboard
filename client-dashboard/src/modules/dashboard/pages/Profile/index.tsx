import { ROUTE_PATH } from 'enums';
import { useState } from 'react';
import { useLocation } from 'react-router';
import TeamContent from './content/TeamContent';
import UserContent from './content/UserContent';
import Sider from './sider';
import { ProfileStyled } from './styles';

const Profile = () => {
  const path = useLocation();

  const [tab, setTab] = useState(
    path.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME ? 'user' : 'team',
  );

  return (
    <ProfileStyled>
      <div className="layout flex">
        <Sider tab={tab} setTab={setTab} />
        {tab === 'user' ? <UserContent /> : <TeamContent />}
      </div>
    </ProfileStyled>
  );
};

export default Profile;
