import { Button } from 'antd';
import { PlusIcon } from 'icons';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';
import SimpleBar from 'simplebar-react';
import { projectRoutePath, useGetAllProjects } from '../util';
import { CustomNavLink, ProjectSiderWrapper } from './style';
import Title from './Title';

const ProjectSider = () => {
  const wrapperRef = useRef<any>();
  const { t } = useTranslation();

  const { projects, isLoading } = useGetAllProjects();

  return (
    <ProjectSiderWrapper ref={wrapperRef}>
      <div className="list flex-column">
        <CustomSpinSuspense spinning={isLoading}>
          <SimpleBar style={{ height: '100%' }}>
            {projects.map(e => (
              <Title
                key={e.id}
                title={e.name}
                routePath={generatePath(projectRoutePath.SURVEY, {
                  projectId: e.id,
                })}
                id={e.id}
              />
            ))}
          </SimpleBar>
        </CustomSpinSuspense>
      </div>
      <div className="add-new-project-btn-wrapper">
        <CustomNavLink to={projectRoutePath.PROJECT.ADD}>
          <Button type="default" className="new-project-btn">
            <PlusIcon />
            {t('common.addNewProject')}
          </Button>
        </CustomNavLink>
      </div>
    </ProjectSiderWrapper>
  );
};

export default ProjectSider;
