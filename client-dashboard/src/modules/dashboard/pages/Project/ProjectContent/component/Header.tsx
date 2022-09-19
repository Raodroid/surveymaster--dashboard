import { ROUTE_PATH } from 'enums';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import { HeaderStyled } from '../style';

function ProjectHeader() {
  return (
    <HeaderStyled className="flex-start">
      <StyledBreadcrumb
        routes={[
          {
            name: 'Project',
            href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.HOME,
          },
          {
            name: 'Microbiome',
            href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT + '/test',
          },
        ]}
      />
    </HeaderStyled>
  );
}

export default ProjectHeader;
