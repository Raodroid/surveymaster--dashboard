import { Dropdown } from 'antd';
import { useParseQueryString } from 'hooks/useParseQueryString';
import { ArrowDown, FilterOutlined } from 'icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectFilterBtn, ProjectFilterWrapper } from '../Header/styles';
import { ProjectFilterOverlay } from './ProjectFilterOverlay';

export interface IFilter {
  counter?: number;
  setCounter?: (payload: number) => void;
}

export interface QsParams {
  q?: string;
  page?: number;
  take?: number;
  isDeleted?: string;
  createdFrom?: string;
  createdTo?: string;
}

function ProjectFilter() {
  const [counter, setCounter] = useState(0);
  const { t } = useTranslation();
  const qsParams = useParseQueryString<QsParams>();

  useEffect(() => {
    const list = Object.values({
      ...qsParams,
      dateCreation:
        qsParams.createdFrom || qsParams.createdTo ? 'true' : 'false',
    }).filter(elm => elm === 'true');
    setCounter(list.length);
  }, [qsParams]);

  return (
    <ProjectFilterWrapper>
      <Dropdown
        overlay={
          <ProjectFilterOverlay counter={counter} setCounter={setCounter} />
        }
        trigger={['click']}
        placement="bottomRight"
      >
        <ProjectFilterBtn
          type="primary"
          className="flex-j-end"
          aria-label={'filter button'}
        >
          <FilterOutlined />
          {t('common.filters')}
          <div className="counter flex-center">
            {counter}
            <ArrowDown />
          </div>
        </ProjectFilterBtn>
      </Dropdown>
    </ProjectFilterWrapper>
  );
}

export default ProjectFilter;
