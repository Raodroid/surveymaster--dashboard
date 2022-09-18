import { Button, Divider, Switch } from 'antd';
import { CustomSlider } from 'modules/common/input/inputs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthAction } from 'redux/auth';
import { UserContentStyled } from '../styles';
import ChangePasswordModal from './modals/ChangePasswordModal';
import SetUpPreferencesModal from './modals/SetUpPreferencesModal';

function UserContent() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [changePassword, setChangePassword] = useState(false);
  const [changePreferences, setChangePreferences] = useState(false);

  return (
    <UserContentStyled className="flex">
      <div className="part padding-24 name title">{t('common.name')}</div>
      <div className="part setting">
        <div className="password padding-24 flex-space-between custom-ant-hover">
          <span className="title">{t('common.password')}</span>
          <Button
            type="primary"
            className="btn"
            onClick={() => setChangePassword(!changePassword)}
          >
            {t('common.change')}
          </Button>
        </div>

        <Divider style={{ margin: 0 }} />

        <div className="notifications padding-24 flex-space-between custom-ant-hover">
          <div className="wrapper">
            <span className="title">{t('common.notifications')}</span>
            <p>
              {t('common.sendNotifications')}{' '}
              <span
                className="preferences"
                onClick={() => setChangePreferences(true)}
              >
                {t('common.setUpPreferences')}
              </span>
            </p>
          </div>
          <div className="wrapper flex-end">
            <span style={{ marginRight: 8 }}>{t('common.turnedOn')}</span>
            <Switch />
          </div>
        </div>
      </div>

      <div className="part others" style={{ flex: 1 }}>
        <div className="padding-24 flex-space-between">
          <div className="wrapper">
            <span className="title">{t('common.signOutAllOtherSessions')}</span>
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
              {t('common.signOutAllOtherSessions')}
            </Button>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        <div className="padding-24 flex-space-between">
          <div className="title">{t('common.deactivateAccount')}</div>
          <Button type="primary" className="btn">
            {t('common.deactivate')}
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
