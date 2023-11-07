import { ProjectHeader, ProjectTable } from '@pages/Project';
import { Radio } from 'antd';
import { useParseQueryString } from '@/hooks';
import { ProjectTypes } from '@/type';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  useCheckScopeEntity,
  useCheckScopeEntityDefault,
} from '@/modules/common';
import { EntityEnum } from '@/enums';

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

  return (
    <div className="w-full h-full flex-column">
      <ProjectHeader showSearch showAddProjectBtn={canCreate} />
      <Radio.Group
        onChange={e =>
          navigate(`${location.pathname}?type=${e.target.value}`, {
            replace: true,
          })
        }
        value={
          !queryParams.type || queryParams.type === 'All'
            ? 'All'
            : ProjectTypes[queryParams.type]
        }
        size={'large'}
        optionType="button"
        buttonStyle="solid"
        className={'w-full flex'}
      >
        {options.map((i, idx) => (
          <Radio.Button
            key={i.value}
            value={i.value}
            className={`flex-1 text-center ${
              idx === 0
                ? '!border-l-0'
                : idx === options.length - 1
                ? 'border-r-0'
                : ''
            }`}
          >
            {i.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <ProjectTable />
    </div>
  );
};

export default ProjectContent;
