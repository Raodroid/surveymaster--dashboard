import { useParseQueryString } from '@/hooks';

import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useCallback } from 'react';
import { CustomTab } from '@/customize-components';
import ChangeLogTable from '../ChangeLogTable/ChangeLogTable';
import { BaseSectionWrapper } from '@/modules/common';
import { FilterComponent } from '@pages/ChangeLog/FilterComponent/FilterComponent';
import { useTranslation } from 'react-i18next';

const options = [
  { label: 'Survey', value: 'Survey' },
  { label: 'Question', value: 'Question' },
];

const ChangeLog = () => {
  const queryParams = useParseQueryString<{ type?: 'Survey' | 'Question' }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleChangeTab = useCallback(
    e => navigate(`${location.pathname}?type=${e.target.value}`),
    [location.pathname, navigate],
  );

  return (
    <BaseSectionWrapper className={'w-full'}>
      <div className="w-full h-full flex flex-col">
        <div className={'p-3 flex items-center justify-between'}>
          <span className={'px-6 py-3 font-semibold text-[16px]'}>
            {t('common.changeLog')}
          </span>
          <FilterComponent type={queryParams.type || 'Survey'} />
        </div>

        <CustomTab
          onChange={handleChangeTab}
          value={queryParams.type || 'Survey'}
          size={'large'}
          options={options}
        />
        <ChangeLogTable type={queryParams.type || 'Survey'} />
      </div>
    </BaseSectionWrapper>
  );
};

export default ChangeLog;
