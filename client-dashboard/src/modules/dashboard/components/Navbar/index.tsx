import React from 'react';
import { NavBarWrapper } from './styles';
import { ROUTE_PATH } from 'enums';
import { LogoBiomeIcon } from 'icons';
import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';
import RightMenu from './RightMenu';

const NavBar = () => {
  return (
    <NavBarWrapper>
      <Link
        to={ROUTE_PATH.DASHBOARD_PATHS.HOME}
        className="logo"
        aria-label="Logo app"
      >
        <LogoBiomeIcon />
      </Link>
      <MainMenu />
      <RightMenu />
    </NavBarWrapper>
  );
};

export default NavBar;
