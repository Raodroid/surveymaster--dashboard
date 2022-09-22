import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ProjectSiderWrapper } from './style';
import Title from './Title';

const ProjectSider = () => {
  const navigate = useNavigate();
  const list = [
    {
      title: 'Microbiome Donor Programme (AMD)',
      routePath: 'Microbiome-Donor-Programme',
    },
    {
      title: 'NCCS Elegance',
      routePath: 'NCCS-Elegance',
    },
    {
      title: 'AMILI-Monash Gut Microbiome (1000MY)',
      routePath: 'AMILI-Monash-Gut-Microbiome',
    },
    {
      title: 'Colon T2',
      routePath: 'Colon-T2',
    },
  ];
  return (
    <ProjectSiderWrapper>
      <div className="list">
        {list.map(e => (
          <Title
            title={e.title}
            routePath={
              ROUTE_PATH.DASHBOARD_PATHS.PROJECT.HOME + '/' + e.routePath
            }
          />
        ))}
      </div>
      <div className="add-new-project-btn-wrapper">
        <Button
          onClick={() =>
            navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_PROJECT)
          }
        >
          <PlusIcon />
          Add New Project
        </Button>
      </div>
    </ProjectSiderWrapper>
  );
};

export default ProjectSider;
