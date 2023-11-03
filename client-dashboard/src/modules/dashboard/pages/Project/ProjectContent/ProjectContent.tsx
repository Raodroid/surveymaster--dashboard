import { SCOPE_CONFIG } from 'enums';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { ProjectHeader, ProjectTable } from '@pages/Project';

const ProjectContent = () => {
  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECT);
  return (
    <div className="w-full h-full flex-column">
      {canRead && (
        <>
          <ProjectHeader search />
          <ProjectTable />
        </>
      )}
    </div>
  );
};

export default ProjectContent;
