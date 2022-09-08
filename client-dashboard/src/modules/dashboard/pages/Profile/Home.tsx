import { Button, Layout, Radio, Tabs, Upload } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { ControlledInput } from 'modules/common';
import siderContentLayout from 'modules/common/hoc/siderContentLayout';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { ProfileStyled } from './styles';
import UserContent from './UserContent';
import { useState } from 'react';
import { CustomImageUpload } from 'modules/common/input/inputs';
import { useNavigate } from 'react-router';
import { FULL_ROUTE_PATH, ROUTE_PATH } from 'enums';
import { useParams } from 'react-router';
import { useLocation } from 'react-router';

const Home = () => {
  const navigate = useNavigate();
  const path = useLocation();

  const [tab, setTab] = useState(
    path.pathname === FULL_ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME
      ? 'user'
      : 'team',
  );

  const handleTabChange = e => {
    setTab(e.target.value);
    if (tab === 'user') navigate(FULL_ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM);
    else navigate(FULL_ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME);
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
            {/* <CustomInput
                inputType={INPUT_TYPES.INPUT}
                type={'text'}
                name="email"
                label="Full Name"
                placeholder="name"
                customFormProps={{ required: true }}
              /> */}
            <input />
          </div>

          <Button className="submit-btn">Save Edits</Button>
        </div>
        <UserContent />
      </div>
    </ProfileStyled>
  );
};

export default Home;
