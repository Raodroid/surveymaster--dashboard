import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components/macro';
import { BodyAppWrapper } from './protected.route';
import { screenSize } from '@/enums';

export const UnProtectedRoutes = () => {
  return (
    <Layout>
      <BodyPublicAppWrapper>
        <div className={'mask-bg'}></div>
        <div className={'app-body-container'}>
          <Outlet />
        </div>
      </BodyPublicAppWrapper>
    </Layout>
  );
};

const BodyPublicAppWrapper = styled(BodyAppWrapper)`
  background: linear-gradient(
    224.6deg,
    rgba(255, 54, 208, 0.64) 0%,
    rgba(64, 219, 255, 0.64) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;

  .mask-bg {
    background: linear-gradient(
      180deg,
      rgba(244, 238, 243, 0) 0%,
      #f4eef3 100%
    );
    position: absolute;
    width: 100%;
    top: 0;
    height: 100%;
  }
  .app-body-container {
    z-index: 1;
  }

  @media only screen and ${screenSize.large} {
    margin: 0;
    padding: 0 1.5rem;
  }
`;
