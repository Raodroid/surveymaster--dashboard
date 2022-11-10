import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckScopeEntityDefault } from '../../../common/hoc';
import { ROUTE_PATH, SCOPE_CONFIG } from '../../../../enums';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../../../../redux/auth';

const Home = () => {
  const navigate = useNavigate();
  const { canRead: canReadProject } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.PROJECTS,
  );
  const isFetching = useSelector(AuthSelectors.getIsFetchingProfile);

  const canReadProjectFinal = isFetching ? true : canReadProject;

  useEffect(() => {
    if (canReadProjectFinal) navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT, {
      replace: true,
    });
  }, [canReadProjectFinal, navigate]);

  return <div>Home Page</div>;
};

export default Home;
