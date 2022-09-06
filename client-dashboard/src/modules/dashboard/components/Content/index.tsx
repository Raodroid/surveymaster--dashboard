/* eslint-disable react-hooks/exhaustive-deps */
import { ROUTE_PATH } from 'enums';
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ContentWrapper, CustomSpinSuspense } from './styles';
import { useMobile } from 'utils';

const Home = lazy(() => import('modules/dashboard/pages/Home'));

const { DASHBOARD_PATHS } = ROUTE_PATH;

const UserLayoutContent = () => {
  const { isMobile } = useMobile();

  return (
    <ContentWrapper isMobile={isMobile}>
      <Suspense fallback={<CustomSpinSuspense />}>
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <Routes>
          <Route path={DASHBOARD_PATHS.HOME} element={<Home />} />
        </Routes>
      </Suspense>
    </ContentWrapper>
  );
};

export default UserLayoutContent;
