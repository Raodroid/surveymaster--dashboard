import { SCOPE_CONFIG } from 'enums';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { ProjectHeader, ProjectTable } from '@pages/Project';

const ProjectContent = () => {
  return (
    <div className="w-full h-full flex-column">
      <ProjectHeader showSearch />
      <ProjectTable />
    </div>
  );
};

export default ProjectContent;
