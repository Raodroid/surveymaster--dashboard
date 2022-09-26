import { ROUTE_PATH } from 'enums';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import APIService from 'services/survey-master-service/base.service';
import { TeamContent, UserContent } from './content';
import Sider from './sider';
import { ProfileStyled } from './styles';

const Profile = () => {
  const path = useLocation();

  const [tab, setTab] = useState(
    path.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME ? 'user' : 'team',
  );

  const scopes = useSelector(state => state);
  console.log(scopes);

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
