import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useMatch } from 'react-router-dom';
import HannahCustomSpin from '../../../components/HannahCustomSpin';
import { useGetAllProjects } from '../util';
import { AddNewProjectBtn, ProjectSiderWrapper } from './style';
import Title from './Title';

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
        <CustomSpinSuspense spinning={isLoading}>
          {projects.map(e => (
            <Title
              key={e.id}
              title={e.name}
              routePath={
                ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', e.id) +
                `?projectName=${e.name}`
              }
              id={e.id}
            />
          ))}
        </CustomSpinSuspense>
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
