import {
  PROFILE_TAB,
  ROUTE_PATH,
  SCOPE_CONFIG,
  STAFF_ADMIN_DASHBOARD_ROLE_LIMIT,
} from 'enums';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useMatch, useNavigate } from 'react-router';
import { TeamContent, UserContent } from './content';
import Sider from './sider';
import { ProfileStyled } from './styles';
import { AuthSelectors } from 'redux/auth';
import { store } from 'store';

const Profile = () => {
  const path = useLocation();
  const navigate = useNavigate();

  const isMatch = useMatch(ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM);

  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.USERS);

  const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);
  const isAdminRole = useMemo(() => {
    return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  }, [currentRoles]);

  const tab = useMemo(() => {
    return path.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT
      ? PROFILE_TAB.USER
      : PROFILE_TAB.TEAM;
  }, [path.pathname]);

  useEffect(() => {
    if (
      Object.keys(store.getState().user.users).length === 0 ||
      Object.keys(store.getState().auth.allRoles).length === 0
    )
      return;
    if (isMatch && (!isAdminRole || !canRead)) {
      navigate(ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT);
    }
  }, [isMatch, navigate, canRead, isAdminRole, store]);

  return (
    <ProfileStyled>
      <div className="layout flex">
        <Sider tab={tab} />
        {tab === 'user' ? <UserContent /> : <TeamContent />}
      </div>
    </ProfileStyled>
  );
};

export default Profile;
