import { ROUTE_PATH } from 'enums';
import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../redux/auth';
import { Layout } from 'antd';
import styled from 'styled-components/macro';
import { CustomSpinSuspense } from '@/modules/common';
const { Content } = Layout;

const LayoutNavbar = lazy(() => import('modules/dashboard/components/Navbar'));

export const ProtectedRoutes = () => {
  const idToken = useSelector(AuthSelectors.getIdToken);
  const isLogged = !!idToken;

  return isLogged ? (
    <Layout className={'mx-10 h-full'}>
      <Suspense fallback={<CustomSpinSuspense />}>
        <LayoutNavbar />
      </Suspense>
      <BodyAppWrapper>
        <Suspense fallback={<CustomSpinSuspense />}>
          <Outlet />
        </Suspense>
      </BodyAppWrapper>
    </Layout>
  ) : (
    <Navigate to={ROUTE_PATH.LOGIN} />
  );
};

export const BodyAppWrapper = styled(Content)`
  height: 100%;
  margin-bottom: 1.5rem;
  max-height: 820px;

  display: flex;
  @media only screen and (max-width: 1440px) {
    padding: 0 2rem;
  }
`;
