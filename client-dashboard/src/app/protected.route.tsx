import { ROUTE_PATH } from 'enums';
import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../redux/auth';
import { Layout } from 'antd';
import styled from 'styled-components';
import { CustomSpinSuspense } from '../modules/common/styles';
const { Content } = Layout;

const LayoutNavbar = lazy(() => import('modules/dashboard/components/Navbar'));

export const ProtectedRoutes = () => {
  const idToken = useSelector(AuthSelectors.getIdToken);
  const isLogged = !!idToken;

  return isLogged ? (
    <ProtectedRouteWrapper>
      <Suspense fallback={<CustomSpinSuspense />}>
        <LayoutNavbar />
      </Suspense>
      <BodyAppWrapper>
        <Suspense fallback={<CustomSpinSuspense />}>
          <Outlet />
        </Suspense>
      </BodyAppWrapper>
    </ProtectedRouteWrapper>
  ) : (
    <Navigate to={ROUTE_PATH.LOGIN} />
  );
};

const ProtectedRouteWrapper = styled(Layout)`
  width: min(1440px, 100%);
  margin: 0 auto;
`;
export const BodyAppWrapper = styled(Content)`
  height: 100%;
  margin-bottom: 1.5rem;

  @media only screen and (max-width: 1440px) {
    padding: 0 2rem;
  }
`;
