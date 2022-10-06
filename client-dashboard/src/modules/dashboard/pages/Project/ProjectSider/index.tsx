import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { mockSurveyList } from '../mockup';
import { AddNewProjectBtn, ProjectSiderWrapper } from './style';
import Title from './Title';

const ProjectSider = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { data } = mockSurveyList;

  const list = [
    {
      title: data?.[0].name,
      routePath:
        data && data[0] && data[0].project && data[0].project.displayId,
    },
    {
      title: data?.[1].name,
      routePath:
        data && data[1] && data[1].project && data[1].project.displayId,
    },
  ];
  return (
    <ProjectSiderWrapper>
      <div className="list">
        {list.map(e => (
          <Title
            key={e.title}
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
          {t('common.addNewProject')}
        </AddNewProjectBtn>
      </div>
    </ProjectSiderWrapper>
  );
};

export default ProjectSider;
