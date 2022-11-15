import { SCOPE_CONFIG } from 'enums';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import ProjectHeader from './components/Header';
import ProjectTable from './components/ProjectTable';
import { ProjectHomeWrapper } from './styles';

const ProjectContent = () => {
  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECTS);
  return (
    <ProjectHomeWrapper className="flex-column">
      {canRead ? (
        <>
          <ProjectHeader search />
          <ProjectTable />
        </>
      ) : null}
    </ProjectHomeWrapper>
  );
};

export default ProjectContent;
