import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { AddNewProjectBtn, ProjectSiderWrapper } from './style';
import Title from './Title';

const ProjectSider = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
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
              ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + '/' + e.routePath
            }
          />
        ))}
      </div>
      <div className="add-new-project-btn-wrapper">
        <AddNewProjectBtn
          onClick={() =>
            navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.ADD)
          }
          type="default"
          className="new-project-btn"
          isAddNewProjectPage={pathname.includes(
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.ADD,
          )}
        >
          <PlusIcon />
          Add New Project
        </AddNewProjectBtn>
      </div>
    </ProjectSiderWrapper>
  );
};

export default ProjectSider;
