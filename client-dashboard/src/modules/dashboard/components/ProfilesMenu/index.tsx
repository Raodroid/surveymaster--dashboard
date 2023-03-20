import React, { useCallback, useMemo, useState } from 'react';
import { Button, Menu, Modal } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MenuWrapper,
  MobileMenuWrapper,
  ProfileCard,
  ProfilesMenuWrapper,
} from './styles';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useDispatch } from 'react-redux';
import { AuthAction } from 'redux/auth';
import ChangeEmailForm from 'modules/auth/change-email/change-email-form/ChangeEmailForm';
import { useMobile } from 'utils';

const defaultMobileMenuSubKey = 'mobile-key';

const { confirm } = Modal;

const ProfilesMenu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobile } = useMobile();
  const dispatch = useDispatch();
  const [isShowModal, setIsShowModal] = useState(false);

  const handleLogOut = useCallback(() => {
    confirm({
      icon: null,
      content: t('common.confirmLogOut'),
      onOk() {
        dispatch(AuthAction.userSignOut());
      },
    });
  }, [dispatch, t]);

  const handleChangeEmail = useCallback(() => {
    setIsShowModal(true);
  }, []);
  const menuItems = useMemo(() => ({}), [t]);

  const [openKey, setOpenKey] = useState<string[] | undefined>(undefined);

  const toggleMobileMenuTab = useCallback(() => {
    setOpenKey(s => (!s ? [defaultMobileMenuSubKey] : undefined));
  }, []);

  const currentTitle = useMemo(
    () => (!openKey ? menuItems[location.pathname] : ''),
    [location.pathname, menuItems, openKey],
  );

  return (
    <ProfilesMenuWrapper id="profile-collapse-menu">
      <ProfileCard className="border">
        {!isMobile ? (
          <>
            <MenuWrapper mode="horizontal" selectedKeys={[location.pathname]}>
              {Object.keys(menuItems).map(key => (
                <Menu.Item key={key}>
                  <span>{menuItems[key]}</span>
                  <Link to={key} aria-label={key} />
                </Menu.Item>
              ))}
            </MenuWrapper>

            <Button
              type={'primary'}
              danger
              onClick={handleChangeEmail}
              style={{ marginRight: '2rem' }}
            >
              {t('userDashboard.common.changeEmail')}
            </Button>
            <Button type={'primary'} danger onClick={handleLogOut}>
              {t('userDashboard.common.logOut')}
            </Button>
          </>
        ) : (
          <MobileMenuWrapper
            selectedKeys={[location.pathname]}
            mode="inline"
            openKeys={openKey}
          >
            <SubMenu
              title={
                <div className={'sub-menu-title'}>
                  {currentTitle ? (
                    <>
                      <span>Profile: </span>
                      <span>{currentTitle}</span>
                    </>
                  ) : (
                    <span>Profile </span>
                  )}
                </div>
              }
              key={defaultMobileMenuSubKey}
              onTitleClick={toggleMobileMenuTab}
            >
              {Object.keys(menuItems).map(key => (
                <Menu.Item key={key} onClick={toggleMobileMenuTab}>
                  <span>{menuItems[key]}</span>
                  <Link to={key} aria-label={key} />
                </Menu.Item>
              ))}
            </SubMenu>
          </MobileMenuWrapper>
        )}
      </ProfileCard>
      {isShowModal && (
        <ChangeEmailForm
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
        />
      )}
    </ProfilesMenuWrapper>
  );
};

export default ProfilesMenu;
