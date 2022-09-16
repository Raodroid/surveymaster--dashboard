import { Radio } from 'antd';
import { ROUTE_PATH } from 'enums';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import { UserService } from 'services';
import TeamContent from './Components/TeamContent';
import UserContent from './Components/UserContent';
import TeamForm from './form/TeamForm';
import UserForm from './form/UserForm';
import { ProfileStyled } from './styles';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = useLocation();

  const { data: profile } = useQuery('me', UserService.getProfile, {
    refetchOnWindowFocus: false,
  });

  const [tab, setTab] = useState(
    path.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME ? 'user' : 'team',
  );

  const handleTabChange = e => {
    setTab(e.target.value);
    if (tab === 'user') navigate(ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM);
    else navigate(ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME);
  };

  return (
    <ProfileStyled>
      <div className="layout flex">
        <div className="sider flex">
          {profile && profile.data.roles.find(e => e === 1) && (
            <div className="tabs flex">
              <Radio.Group value={tab} onChange={handleTabChange}>
                <Radio.Button className="flex-center" value="user">
                  {t('titles.user')}
                </Radio.Button>
                <Radio.Button className="flex-center" value="team">
                  {t('titles.team')}
                </Radio.Button>
              </Radio.Group>
            </div>
          )}

          <div className="inputs">
            {tab === 'user' ? <UserForm /> : <TeamForm />}
          </div>
        </div>
        {tab === 'user' ? <UserContent /> : <TeamContent />}
      </div>
    </ProfileStyled>
  );
};

export default Profile;
