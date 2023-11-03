import React, { memo, useEffect } from 'react';
import { NavBarWrapper } from './styles';
import { DEFAULT_THEME_COLOR, ROUTE_PATH } from 'enums';
import { LogoIcon } from 'icons';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import RightMenu from './RightMenu';
import MobileMenu from './MobileMenu';
import { ConfigProvider } from 'antd';
import { setSecondaryColor } from '@/modules/common';
import { useMobile } from '@/utils';

const NavBar = () => {
  const { isMobile } = useMobile();

  useEffect(() => {
    ConfigProvider.config({
      theme: {
        errorColor: DEFAULT_THEME_COLOR.ERROR,
        successColor: DEFAULT_THEME_COLOR.SUCCESS,
        warningColor: DEFAULT_THEME_COLOR.WARNING,
        primaryColor: DEFAULT_THEME_COLOR.PRIMARY,
      },
    });

    setSecondaryColor(DEFAULT_THEME_COLOR.SECONDARY);
  }, []);
  return (
    <NavBarWrapper>
      {isMobile ? (
        <MobileMenu />
      ) : (
        <>
          <Link
            to={ROUTE_PATH.DASHBOARD_PATHS.HOME}
            className="logo"
            aria-label="Logo app"
          >
            <LogoIcon style={{ transform: 'translateY(-3px)' }} />
          </Link>
          <MainMenu />
          <RightMenu />
        </>
      )}
    </NavBarWrapper>
  );
};

export default memo(NavBar);
