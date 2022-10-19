import { PlusIcon } from 'icons';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router';
import { useMatch } from 'react-router-dom';
import { projectRoutePath, useGetAllProjects } from '../util';
import { AddNewProjectBtn, ProjectSiderWrapper } from './style';
import Title from './Title';
import SimpleBar from 'simplebar-react';

const ProjectSider = () => {
  const wrapperRef = useRef<any>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { projects, isLoading } = useGetAllProjects();

  const isActive = useMatch({
    path: projectRoutePath.PROJECT.ADD,
  });

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
        <AddNewProjectBtn
          onClick={() => navigate(projectRoutePath.PROJECT.ADD)}
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
