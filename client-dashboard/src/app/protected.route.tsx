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

  // const { data: profile } = useQuery('me', UserService.getProfile, {
    
  // });
  // const location = useLocation();

  // if (
  //   profile &&
  //   !profile.data.roles.find(e => e === 1) &&
  //   location.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM
  // )
  //   return <Navigate to="/app" />;

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
