import { ROUTE_PATH } from 'enums';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import { useHref, useLocation } from 'react-router';
import { useParams } from 'react-router';
import { HeaderStyled } from '../style';
import { useMemo } from 'react';

function ProjectHeader(props: { routes?: any }) {
  const { routes } = props;

  const base = [
    {
      name: 'Project',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.HOME,
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
