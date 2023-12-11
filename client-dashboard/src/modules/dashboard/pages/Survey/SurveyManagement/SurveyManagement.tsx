import { ROUTE_PATH } from '@/enums';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { ProjectService } from 'services';
import { ProjectHeader } from '@pages/Project';
import { IBreadcrumbItem } from '@/modules/common';
import SurveyTable from '@pages/Survey/SurveyManagement/SurveyTable';
import { QsParams } from '@/type';
import { CustomTab } from '@/customize-components';
import { useParseQueryString } from '@/hooks';
import { onError } from '@/utils';

const options = [
  { label: 'Active', value: 'false' },
  { label: 'Deleted', value: 'true' },
];

function SurveyManagement() {
  const params = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const qsParams = useParseQueryString<QsParams>();

  const handleChangeTab = useCallback(
    e => navigate(`${location.pathname}?isDeleted=${e.target.value}`),
    [navigate],
  );

  const { data: project } = useQuery(
    ['project', params.projectId],
    () => ProjectService.getProjectById(params.projectId),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: !!params.projectId,
    },
  );

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.data.name || '...',
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY,
      },
    ],
    [project],
  );
  return (
    <div className="h-full flex flex-col">
      <ProjectHeader
        showAddSurveyBtn
        showEditProjectBtn
        showDetailProjectBtn
        routes={routes}
        showSearch
      />
      <CustomTab
        onChange={handleChangeTab}
        value={qsParams.isDeleted}
        size={'large'}
        options={options}
      />

      <SurveyTable />
    </div>
  );
}

export default SurveyManagement;
