import { ProjectHeader, ProjectTable } from '@pages/Project';
import { useParseQueryString } from '@/hooks';
import { ProjectTypes } from '@/type';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useCheckScopeEntityDefault } from '@/modules/common';
import { EntityEnum } from '@/enums';
import { useCallback } from 'react';
import { CustomTab } from '@/customize-components';

const options = [
  { label: 'All', value: 'All' },
  { label: 'Internal', value: ProjectTypes.INTERNAL },
  { label: 'External', value: ProjectTypes.EXTERNAL },
];

const ProjectContent = () => {
  const queryParams = useParseQueryString<{ type?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { canCreate } = useCheckScopeEntityDefault(EntityEnum.SURVEY);

  const handleChangeTab = useCallback(
    e => navigate(`${location.pathname}?type=${e.target.value}`),
    [location.pathname, navigate],
  );

  return (
    <div className="w-full h-full flex flex-col">
      <ProjectHeader showSearch showAddProjectBtn={canCreate} />
      <CustomTab
        onChange={handleChangeTab}
        value={
          !queryParams.type || queryParams.type === 'All'
            ? 'All'
            : ProjectTypes[queryParams.type]
        }
        size={'large'}
        options={options}
      />
      <ProjectTable />
    </div>
  );
};

export default ProjectContent;
