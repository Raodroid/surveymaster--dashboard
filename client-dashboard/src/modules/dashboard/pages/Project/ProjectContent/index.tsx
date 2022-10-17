import ProjectHeader from './components/Header';
import ProjectTable from './components/ProjectTable';
import { ProjectHomeWrapper } from './styles';

const ProjectContent = () => {
  return (
    <ProjectHomeWrapper className="flex-column">
      <ProjectHeader search />
      <ProjectTable />
    </ProjectHomeWrapper>
  );
};

export default ProjectContent;
