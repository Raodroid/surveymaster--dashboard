import { Layout } from 'antd';
import { ROUTE_PATH } from 'enums';
import { lazy } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { Navigate, Outlet } from 'react-router-dom';
import { UserService } from 'services';
import styled from 'styled-components';
import { AuthSelectors } from '../redux/auth';
const { Content } = Layout;

const LayoutNavbar = lazy(() => import('modules/dashboard/components/Navbar'));

export const ProtectedRoutes = () => {
  const idToken = useSelector(AuthSelectors.getIdToken);
  const isLogged = !!idToken;

  return isLogged ? (
    <ProtectedRouteWrapper>
      <LayoutNavbar />
      <BodyAppWrapper>
        <Outlet />
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

  display: flex;
  @media only screen and (max-width: 1440px) {
    padding: 0 2rem;
  }
`;
