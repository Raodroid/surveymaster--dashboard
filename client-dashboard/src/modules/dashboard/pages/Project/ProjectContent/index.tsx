import { useState } from 'react';
import { useDebounce } from 'utils';
import ProjectHeader from './components/Header';
import ProjectTable from './components/ProjectTable';
import { ProjectHomeWrapper } from './style';

const ProjectContent = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const debounce = useDebounce(search);

  return (
    <ProjectHomeWrapper className="flex-column">
      <ProjectHeader
        search={search}
        setSearch={setSearch}
        setFilter={setFilter}
        debounce={debounce}
      />
      <ProjectTable filterValue={filter} />
    </ProjectHomeWrapper>
  );
};

export default ProjectContent;
