import { Button } from 'antd';
import { SCOPE_CONFIG } from 'enums';
import { PlusIcon } from 'icons';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
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

  const { canCreate, canRead } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.PROJECTS,
  );

  return (
    <ProjectSiderWrapper ref={wrapperRef}>
      {canRead ? (
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
      ) : null}
      {canCreate ? (
        <div className="add-new-project-btn-wrapper">
          <CustomNavLink to={projectRoutePath.PROJECT.ADD}>
            <div className="new-project-btn">
              <PlusIcon />
              <span>{t('common.addNewProject')}</span>
            </div>
          </CustomNavLink>
        </div>
      ) : null}
    </ProjectSiderWrapper>
  );
};

export default ProjectSider;
