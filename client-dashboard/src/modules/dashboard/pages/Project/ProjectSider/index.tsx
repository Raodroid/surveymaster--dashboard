import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import React, { useState } from 'react';
import { ProjectSiderWrapper } from './style';
import Title from './Title';

const ProjectSider = () => {
  const list = [
    {
      title: 'Microbiome Donor Programme (AMD)',
      routePath: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.MICROBIOME_DONOR_PROGRAMME,
    },
    {
      title: 'NCCS Elegance',
      routePath: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.NCCS_ELEGANCE,
    },
    {
      title: 'AMILI-Monash Gut Microbiome (1000MY)',
      routePath: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.AMILI_MONASH_GUT_MICROBIOME,
    },
    {
      title: 'Colon T2',
      routePath: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.COLON_T2,
    },
  ];
  return (
    <ProjectSiderWrapper>
      <div className="list">
        {list.map(e => (
          <Title title={e.title} routePath={e.routePath} />
        ))}
      </div>
      <div className="add-new-project-btn-wrapper">
        <Button>
          <PlusIcon />
          Add New Project
        </Button>
      </div>
    </ProjectSiderWrapper>
  );
};

export default ProjectSider;
