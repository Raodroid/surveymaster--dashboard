import { Radio } from 'antd';
import { ROUTE_PATH } from 'enums';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { UserService } from 'services';
import TeamForm from './form/TeamForm';
import UserForm from './form/UserForm';

interface SiderProps {
  tab: string;
  setTab: (e: any) => void;
}

function Sider(props: SiderProps) {
  const { tab, setTab } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: profile } = useQuery('me', UserService.getProfile, {
    refetchOnWindowFocus: false,
  });

  const handleTabChange = e => {
    setTab(e.target.value);
    if (tab === 'user') navigate(ROUTE_PATH.DASHBOARD_PATHS.PROFILE.TEAM);
    else navigate(ROUTE_PATH.DASHBOARD_PATHS.PROFILE.HOME);
  };
  return (
    <div className="sider flex">
      {profile && profile.data.userRoles.find(e => e.roleId === 1) && (
      // {profile && profile.data.roles.find(e => e === 1) && (
        <div className="tabs flex">
          <Radio.Group value={tab} onChange={handleTabChange}>
            <Radio.Button className="flex-center" value="user">
              {t('titles.user')}
            </Radio.Button>
            <Radio.Button className="flex-center" value="team">
              {t('titles.team')}
            </Radio.Button>
          </Radio.Group>
        </div>
      )}

      <div className="form">{tab === 'user' ? <UserForm /> : <TeamForm />}</div>
    </div>
  );
}

export default Sider;
