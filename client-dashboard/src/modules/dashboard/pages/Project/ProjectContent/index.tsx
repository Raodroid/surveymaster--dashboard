import { CustomSpinSuspense } from 'modules/common/styles';
import ProjectHeader from './component/Header';
import ProjectTable from './component/ProjectTable';
import { ProjectHomeWrapper } from './style';
import { useState } from 'react';
import { useDebounce } from 'utils';
import { useParams } from 'react-router';

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
