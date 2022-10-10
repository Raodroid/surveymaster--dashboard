import { ROUTE_PATH } from 'enums';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { mockSurveyList } from 'type';
import ProjectHeader from '../../Header';

function ActionHistory() {
  const params = useParams();
  const { t } = useTranslation();

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);
  const survey = data.find(elm => elm.displayId === params.detailId);

  const routes = useMemo(
    () => [
      {
        name: project?.name,
        href:
          params &&
          params.id &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', params.id),
      },
      {
        name: survey?.project?.name,
        href:
          params &&
          params.id &&
          params.detailId &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT.replace(
            ':id',
            params.id,
          ).replace(':detailId', params.detailId),
      },
      {
        name: 'Action History',
        href: '',
      },
    ],
    [project, params, survey],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <div>{t('common.actionHistory')}</div>
    </>
  );
}

export default ActionHistory;
