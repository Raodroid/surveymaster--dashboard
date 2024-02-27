import {
  PROFILE_TAB,
  ROUTE_PATH,
  SCOPE_CONFIG,
  STAFF_ADMIN_DASHBOARD_ROLE_LIMIT,
} from 'enums';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { TeamContent, UserContent } from './content';
import Sider from './sider';
import { ProfileStyled } from './styles';
import { AuthSelectors } from 'redux/auth';

const Profile = () => {
  const path = useLocation();

  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.USER);

  const currentRoles = useSelector(AuthSelectors.getCurrentScopes);
  const isAdminRole = useMemo(() => {
    return currentRoles.some(role =>
      STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(role.id),
    );
  }, [currentRoles]);

  const tab = useMemo(() => {
    return path.pathname === ROUTE_PATH.DASHBOARD_PATHS.PROFILE.ROOT
      ? PROFILE_TAB.USER
      : PROFILE_TAB.TEAM;
  }, [path.pathname]);

  return (
    <ProfileStyled>
      <div className="layout flex">
        <Sider tab={tab} />
        {tab === 'user' || !isAdminRole || !canRead ? (
          <UserContent />
        ) : (
          <TeamContent />
        )}
      </div>
    </ProfileStyled>
  );
};

export default Profile;
