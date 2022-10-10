import { CustomSpinSuspense } from 'modules/common/styles';
import ProjectHeader from './component/Header';
import ProjectTable from './component/ProjectTable';
import { ProjectHomeWrapper } from './style';

const ProjectContent = () => {
  // const [search, setSearch] = useState('');

  return (
    <ProjectHomeWrapper className="flex-column">
      <ProjectHeader />
      <ProjectTable />
    </ProjectHomeWrapper>
  );
};

export default ProjectContent;
