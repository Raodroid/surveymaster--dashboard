import { ROUTE_PATH } from 'enums';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import React from 'react';
import Home from '../../Home';
import { HeaderStyled } from '../style';

function ProjectHeader() {
  return (
    <HeaderStyled>
      <StyledBreadcrumb
        routes={[
          {
            name: 'Project',
            href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.HOME,
          },
          {
            name: 'Microbiome',
            href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.MICROBIOME_DONOR_PROGRAMME
              .HOME,
          },
        ]}
        rightEndBreadcrumbComponent={<></>}
      />
    </HeaderStyled>
  );
}

export default ProjectHeader;
