import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';
import { AuthSelectors } from 'redux/auth/index';
import { Component, HigherOrderComType } from '../../../type';
import { useParseQueryString } from '../../../hooks';

const requireAuthentication: HigherOrderComType = (Com: Component) => {
  return props => {
    const isLogged = !!useSelector(AuthSelectors.getIdToken);
    const navigator = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const { nextUrl } = useParseQueryString<{ nextUrl?: string }>();

    useEffect(() => {
      if (isLogged) {
        if (currentPath === '/login' && nextUrl) {
          return navigator(nextUrl as string);
        }
        return navigator(ROUTE_PATH.DASHBOARD_PATHS.HOME);
      }
    }, [isLogged, navigator, currentPath, nextUrl]);
    return <Com {...props} />;
  };
};
export default requireAuthentication;
