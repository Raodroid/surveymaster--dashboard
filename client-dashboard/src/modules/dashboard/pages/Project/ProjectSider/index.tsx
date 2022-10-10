import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { AddNewProjectBtn, ProjectSiderWrapper } from './style';
import Title from './Title';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import { useGetAllProjects } from '../util';
import HannahCustomSpin from '../../../components/HannahCustomSpin';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router-dom';

const ProjectSider = () => {
  const wrapperRef = useRef<any>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { projects, isLoading } = useGetAllProjects();

  const isActive = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.ADD,
  });

  return (
    <ProjectSiderWrapper ref={wrapperRef}>
      <div className="list">
        <HannahCustomSpin parentRef={wrapperRef} spinning={isLoading} />
        {projects.map(e => (
          <Title
            key={e.displayId}
            title={e.name}
            routePath={
              ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + '/' + e.displayId
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
          isAddNewProjectPage={!!isActive}
        >
          <PlusIcon />
          {t('common.addNewProject')}
        </AddNewProjectBtn>
      </div>
    </ProjectSiderWrapper>
  );
};

export default ProjectSider;
