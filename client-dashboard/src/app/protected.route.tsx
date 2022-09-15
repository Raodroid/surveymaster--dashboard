import { Layout } from 'antd';
import { ROUTE_PATH } from 'enums';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { AuthSelectors } from '../redux/auth';
const { Content } = Layout;

const LayoutNavbar = lazy(() => import('modules/dashboard/components/Navbar'));

export const ProtectedRoutes = () => {
  const idToken = useSelector(AuthSelectors.getIdToken);
  const isLogged = !!idToken;
  const params = useParams();

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
