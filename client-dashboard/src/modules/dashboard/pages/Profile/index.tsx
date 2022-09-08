import { FULL_ROUTE_PATH, ROUTE_PATH } from 'enums';
import React from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import Home from './Components/Home';
import Team from './Components/Team';

const Profile = () => {
  const route_path = ROUTE_PATH.DASHBOARD_PATHS.PROFILE;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={route_path.TEAM} element={<Team />} />
    </Routes>
  );
};

export default Profile;
