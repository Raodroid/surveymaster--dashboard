import { FULL_ROUTE_PATH } from 'enums';
import React, { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../redux/auth';
import { Layout } from 'antd';
import styled from 'styled-components';
const { Content } = Layout;

const LayoutNavbar = lazy(() => import('modules/dashboard/components/Navbar'));

export const ProtectedRoutes = () => {
  const idToken = useSelector(AuthSelectors.getIdToken);
  const isLogged = !!idToken;

  return isLogged ? (
    <Layout>
      <LayoutNavbar />
      <BodyAppWrapper>
        <Outlet />
      </BodyAppWrapper>
    </Layout>
  ) : (
    <Navigate to={FULL_ROUTE_PATH.LOGIN} />
  );
};

const BodyAppWrapper = styled(Content)`
  @media only screen and (max-width: 1440px) {
    margin: 0 2rem;
  }
`;
