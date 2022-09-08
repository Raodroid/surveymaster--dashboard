import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FULL_ROUTE_PATH, ROUTE_PATH } from 'enums';
import { AuthSelectors } from 'redux/auth/index';
import { Component, HigherOrderComType } from '../../../type';
import qs from 'qs';

const requireAuthentication: HigherOrderComType = (Com: Component) => {
  return props => {
    const isLogged = !!useSelector(AuthSelectors.getIdToken);
    const navigator = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const { nextUrl } = qs.parse(location.search, { ignoreQueryPrefix: true });
    console.log(nextUrl);
    useEffect(() => {
      if (isLogged) {
        if (currentPath === '/login' && nextUrl) {
          return navigator(nextUrl as string);
        }
        return navigator(FULL_ROUTE_PATH.DASHBOARD_PATHS.HOME);
      }
    }, [isLogged, navigator, currentPath, nextUrl]);
    return <Com {...props} />;
  };
};
export default requireAuthentication;
