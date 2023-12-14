import { Popover } from 'antd';
import { useParseQueryString } from '@/hooks/useParseQueryString';
import { ArrowDown, FilterOutlined } from '@/icons';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectFilterBtn } from './styles';
import { ProjectFilterOverlay } from './ProjectFilterOverlay';
import { QsParams } from '@/type';

export interface IFilter {
  counter?: number;
  setCounter?: (payload: number) => void;
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
    <Popover
      content={
        <ProjectFilterOverlay counter={counter} setCounter={setCounter} />
      }
      trigger={['click']}
      placement="bottomRight"
    >
      <ProjectFilterBtn
        type="primary"
        className="flex justify-end"
        aria-label={'filter button'}
      >
        <FilterOutlined />
        {t('common.filters')}
        <div className="counter flex-center">
          {counter}
          <ArrowDown />
        </div>
      </ProjectFilterBtn>
    </Popover>
  );
}

export default memo(ProjectFilter);
