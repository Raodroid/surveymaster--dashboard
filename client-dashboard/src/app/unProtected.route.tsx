import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';
import { BodyAppWrapper } from './protected.route';
import { screenSize } from '../enums';

export const UnProtectedRoutes = () => {
  return (
    <Layout>
      <BodyPublicAppWrapper>
        <Outlet />
      </BodyPublicAppWrapper>
    </Layout>
  );
};

const BodyPublicAppWrapper = styled(BodyAppWrapper)`
  background: indianred;
  @media only screen and ${screenSize.large} {
    margin: 0;
    padding: 0 1.5rem;
  }
`;
