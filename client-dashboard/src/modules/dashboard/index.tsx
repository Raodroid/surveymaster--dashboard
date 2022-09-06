/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';

import { CustomSpinSuspense } from './components/Content/styles';

const UserLayoutNavbar = lazy(() => import('./components/Navbar'));
const UserLayoutContent = lazy(() => import('./components/Content'));

const ContainerLayout = styled.div`
  background: #fbf8f6;
  display: flex;
  flex-direction: column;
`;

const UserDashboardLayout = () => {
  return (
    <ContainerLayout>
      <Suspense fallback={<CustomSpinSuspense />}>
        {/*<UserLayoutNavbar />*/}
        <UserLayoutContent />
      </Suspense>
    </ContainerLayout>
  );
};

export default UserDashboardLayout;
