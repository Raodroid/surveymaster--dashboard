import React from 'react';
import { Link } from 'react-router-dom';

import { PublicNavbar } from './style';
import { ROUTE_PATH } from 'enums';
import { LogoIcon } from 'icons';

const AuthLayout = ({ children }) => {
  return (
    <>
      <PublicNavbar>
        <Link to={ROUTE_PATH.HOME} className="logo" aria-label="Logo app">
          <LogoIcon />
        </Link>
      </PublicNavbar>
      {children}
    </>
  );
};

export default AuthLayout;
