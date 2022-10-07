import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { ProjectService } from 'services';
import { mockSurveyList } from '../mockup';
import { AddNewProjectBtn, ProjectSiderWrapper } from './style';
import Title from './Title';

const ProjectSider = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { data } = mockSurveyList;

  const queryParams = {
    q: '',
    page: 1,
    take: 10,
    isDeleted: false,
  };

  const { data: projects, isLoading } = useQuery(
    ['projects'],
    () => ProjectService.getProjects(queryParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const list = useMemo(
    () =>
      projects?.data.data.map(elm => {
        return {
          title: elm.name,
          routePath:
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', elm.id) +
            `?projectName=${elm.name}`,
          id: elm.id,
        };
      }),
    [projects],
  );

  return (
    <ProjectSiderWrapper>
      <div className="list">
        {list &&
          list.map((e: any) => (
            <Title
              key={e.title}
              title={e.title}
              routePath={e.routePath}
              id={e.id}
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
