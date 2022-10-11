import { useState } from 'react';
import { IGetParams } from 'type';
import { useDebounce } from 'utils';
import ProjectHeader from './components/Header';
import ProjectTable from './components/ProjectTable';
import { ProjectHomeWrapper } from './styles';

const ProjectContent = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const debounce = useDebounce(search);

  const [params, setParams] = useState<IGetParams>({
    isDeleted: false,
    createdFrom: '',
    createdTo: '',
  });

  return (
    <ProjectHomeWrapper className="flex-column">
      <ProjectHeader
        search={search}
        setSearch={setSearch}
        setFilter={setFilter}
        debounce={debounce}
        setParams={setParams}
      />
      <ProjectTable filterValue={filter} queryParams={params} />
    </ProjectHomeWrapper>
  );
};

export default ProjectContent;
