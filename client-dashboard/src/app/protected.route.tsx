import { ROUTE_PATH } from 'enums';
import React, { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../redux/auth';
import { Layout } from 'antd';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { UserService } from 'services';
import { useParams } from 'react-router';
const { Content } = Layout;

const LayoutNavbar = lazy(() => import('modules/dashboard/components/Navbar'));

export const ProtectedRoutes = () => {
  const idToken = useSelector(AuthSelectors.getIdToken);
  const isLogged = !!idToken;
  const params = useParams();

  const userRoles = useSelector(AuthSelectors.getAllRoles);
  const userRolesList = Object.keys(userRoles);
  if (
    !userRolesList.includes('1') &&
    params.path ===
      ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME +
        '/' +
        ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM
  ) {
    return <Navigate to="/app" />;
  }

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
  @media only screen and (max-width: 1440px) {
    margin: 0 2rem;
  }
`;
