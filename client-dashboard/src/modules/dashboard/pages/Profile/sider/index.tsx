import { Radio } from 'antd';
import {
  PROFILE_TAB,
  ROUTE_PATH,
  STAFF_ADMIN_DASHBOARD_ROLE_LIMIT
} from 'enums';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import { SiderWrapper } from '../styles';
import TeamForm from './form/TeamForm';
import UserForm from './form/UserForm';

interface SiderProps {
  tab: string;
}

function Sider(props: SiderProps) {
  const { tab } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROFILE;
  const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);
  const isAdminRole = useMemo(() => {
    return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  }, [currentRoles]);

  return (
    <SiderWrapper className="sider flex">
      {isAdminRole && (
        <div className="tabs flex">
          <Radio.Group value={tab}>
            <Radio.Button
              className="flex-center"
              onChange={() => navigate(routePath.ROOT)}
              value={PROFILE_TAB.USER}
            >
              {t('titles.user')}
            </Radio.Button>
            <Radio.Button
              className="flex-center"
              onChange={() => navigate(routePath.TEAM)}
              value={PROFILE_TAB.TEAM}
            >
              {t('titles.team')}
            </Radio.Button>
          </Radio.Group>
        </div>
      )}

      <div className="form">
        {tab === PROFILE_TAB.USER ? <UserForm /> : <TeamForm />}
      </div>
    </SiderWrapper>
  );
}

export default Sider;
