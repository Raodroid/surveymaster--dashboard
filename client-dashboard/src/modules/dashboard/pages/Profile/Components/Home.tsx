import { Radio } from 'antd';
import { ROUTE_PATH } from 'enums';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import UserForm from '../form/UserForm';
import { ProfileStyled } from '../styles';
import UserContent from './UserContent';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = useLocation();

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

          <div className="inputs">
            <UserForm />
          </div>
        </div>
        <UserContent />
      </div>
    </ProfileStyled>
  );
};

export default Home;
