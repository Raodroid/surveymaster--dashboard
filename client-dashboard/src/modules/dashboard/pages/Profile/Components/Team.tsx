import { Button, Radio } from 'antd';
import { ROUTE_PATH } from 'enums';
import { CustomImageUpload } from 'modules/common/input/inputs';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import TeamForm from '../form/TeamForm';
import { ProfileStyled } from '../styles';
import UserContent from './UserContent';

const Team = () => {
  const navigate = useNavigate();
  const path = useLocation();

  const [tab, setTab] = useState(
    path.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME
      ? 'user'
      : 'team',
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
                User
              </Radio.Button>
              <Radio.Button className="flex-center" value="team">
                Team
              </Radio.Button>
            </Radio.Group>
          </div>
          <div className="avatar">
            <strong>Photo</strong>
            <CustomImageUpload value="" />
          </div>

          <div className="buttons flex">
            <Button>Upload New Photo</Button>
            <Button>Remove Photo</Button>
          </div>

          <div className="inputs">
            <TeamForm />
          </div>
        </div>
        <UserContent />
      </div>
    </ProfileStyled>
  );
};

export default Team;
