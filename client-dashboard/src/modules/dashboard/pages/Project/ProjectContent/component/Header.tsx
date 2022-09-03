import { SearchOutlined } from '@ant-design/icons';
import { ROUTE_PATH } from 'enums';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import { HeaderStyled } from '../style';

function ProjectHeader(props: { routes?: any }) {
  const { routes } = props;

  const base = [
    {
      name: 'Project',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
    },
  ];

  if (routes) base.push(...routes);

  return (
    <HeaderStyled className="flex-start">
      <StyledBreadcrumb routes={base} />
    </HeaderStyled>
  );
}

export default ProjectHeader;
