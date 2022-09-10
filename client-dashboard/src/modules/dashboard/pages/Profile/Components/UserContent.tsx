import { Button, Divider, Switch } from 'antd';
import { CustomSlider } from 'modules/common/input/inputs';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthAction } from 'redux/auth';
import { UserContentStyled } from '../styles';
import ChangePasswordModal from './modals/ChangePasswordModal';
import SetUpPreferencesModal from './modals/SetUpPreferencesModal';

function UserContent() {
  const dispatch = useDispatch();
  const [changePassword, setChangePassword] = useState(false);
  const [changePreferences, setChangePreferences] = useState(false);

  return (
    <UserContentStyled className="flex">
      <div className="part padding-24 name title">name</div>
      <div className="part  setting">
        <div className="password padding-24 flex-space-between">
          <span className="title">Password</span>
          <Button
            type="primary"
            className="btn"
            onClick={() => setChangePassword(!changePassword)}
          >
            Change
          </Button>
        </div>

        <Divider style={{ margin: 0 }} />

        <div className="notifications padding-24 flex-space-between">
          <div className="wrapper">
            <span className="title">Notifications</span>
            <p>
              Send notifications to your email.{' '}
              <span
                className="preferences"
                onClick={() => setChangePreferences(true)}
              >
                Set Up Preferences
              </span>
            </p>
          </div>
          <div className="wrapper flex-end">
            <span style={{ marginRight: 8 }}>Turned on</span>
            <Switch />
          </div>
        </div>
      </div>

      <div className="part others" style={{ flex: 1 }}>
        <div className="padding-24 flex-space-between">
          <div className="wrapper">
            <span className="title">Sign Out All Other Sessions</span>
            <p>
              Lost your phone? Left yourself logged in on a public computer?
              Need a way to sign out everywhere except your current browser?
              This is for you.
            </p>
          </div>
          <div className="wrapper flex-end">
            <Button
              type="primary"
              className="btn"
              onClick={() => dispatch(AuthAction.userSignOut(true))}
            >
              Sign out all other sessions
            </Button>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        <div className="padding-24 flex-space-between">
          <div className="title">Deactivate Account</div>
          <Button type="primary" className="btn">
            Deactivate
          </Button>
        </div>

        <Divider style={{ margin: 0 }} />

        <div
          className="padding-24 flex-space-between"
          style={{ flex: 1 }}
        ></div>
      </div>

      <ChangePasswordModal
        showModal={changePassword}
        setShowModal={setChangePassword}
      />
      <SetUpPreferencesModal
        showModal={changePreferences}
        setShowModal={setChangePreferences}
      />
    </UserContentStyled>
  );
}

export default UserContent;
