import { ROUTE_PATH } from 'enums';
import { Route, Routes } from 'react-router';
import Home from './Components/Home';

const Profile = () => {
  const route_path = ROUTE_PATH.DASHBOARD_PATHS.PROFILE;
  const teamPath = route_path.TEAM.split('/');

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={teamPath[teamPath.length - 1]} element={<Home />} />
    </Routes>
  );
};

export default Profile;
