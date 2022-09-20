import React from 'react';
import { NavBarWrapper } from './styles';
import { ROUTE_PATH } from 'enums';
import { LogoIcon } from 'icons';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import RightMenu from './RightMenu';
import { useMobile } from '../../../../utils';
import MobileMenu from './MobileMenu';

const NavBar = () => {
  const { isMobile } = useMobile();
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
            <LogoIcon />
          </Link>
          <MainMenu />
          <RightMenu />
        </>
      )}
    </NavBarWrapper>
  );
};

export default NavBar;
