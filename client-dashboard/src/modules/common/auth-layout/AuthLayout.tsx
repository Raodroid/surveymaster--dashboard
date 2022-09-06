import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { PublicNavbar, PublicNavbarRight, ImageGradientStyled } from './style';
import { ROUTE_PATH } from 'enums';
import { AuthSelectors, AuthUtils } from 'redux/auth';
import { LogoBiome } from 'icons';

const AuthLayout = ({ children }) => {
  return (
    <ImageGradientStyled>
      <PublicNavbar>
        <Link to={ROUTE_PATH.HOME} className="logo" aria-label="Logo app">
          <LogoBiome />
        </Link>{' '}
      </PublicNavbar>
      {children}
    </ImageGradientStyled>
  );
};

export default AuthLayout;
