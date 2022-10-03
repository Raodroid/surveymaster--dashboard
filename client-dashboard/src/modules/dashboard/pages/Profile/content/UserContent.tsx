import { Button, Divider, Switch } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AuthAction } from 'redux/auth';
import { UserContentStyled } from '../styles';
import { ChangePasswordModal, SetUpPreferencesModal } from './modals';

function UserContent() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [changePassword, setChangePassword] = useState(false);
  const [changePreferences, setChangePreferences] = useState(false);

  return (
    <UserContentStyled className="flex">
      <div className="cell padding-24 name title">{t('common.name')}</div>
      <div className="cell setting">
        <div className="password padding-24 flex-space-between">
          <span className="title">{t('common.password')}</span>
          <Button
            type="primary"
            className="btn info-btn"
            onClick={() => setChangePassword(!changePassword)}
          >
            {t('common.change')}
          </Button>
        </div>

        <Divider />

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
          <div className="wrapper flex-end switch-wrapper">
            <span>{t('common.turnedOn')}</span>
            <Switch className="info-btn" />
          </div>
        </div>
      </div>

      <div className="cell others">
        <div className="padding-24 flex-space-between">
          <div className="wrapper">
            <span className="title">{t('common.signOutAllOtherSessions')}</span>
            <p>{t('sign')}</p>
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

        <Divider />

        <div className="padding-24 flex-space-between">
          <div className="title">{t('common.deactivateAccount')}</div>
          <Button type="primary" className="btn">
            {t('common.deactivate')}
          </Button>
        </div>

        <Divider />

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
