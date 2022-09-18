import { ROUTE_PATH } from 'enums';
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
    <Navigate to={ROUTE_PATH.LOGIN} />
  );
};

export const BodyAppWrapper = styled(Content)`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  max-height: calc(100vh - 70px);

  @media only screen and (max-width: 1440px) {
    margin: 0 2rem;
  }
`;
