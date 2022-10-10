import { CustomSpinSuspense } from 'modules/common/styles';
import ProjectHeader from './components/Header';
import ProjectTable from './components/ProjectTable';
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
