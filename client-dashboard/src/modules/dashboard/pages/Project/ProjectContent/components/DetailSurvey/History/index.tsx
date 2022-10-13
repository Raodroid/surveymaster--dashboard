import {
  getProjectTitle,
  projectRoutePath,
} from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useLocation, useParams } from 'react-router';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';

function ActionHistory(props: DetailSurveyProps) {
  const { surveyData: survey } = props;
  const params = useParams();
  const { t } = useTranslation();
  const { search } = useLocation();

  const title = useMemo(() => getProjectTitle(search), [search]);

  const routes = useMemo(
    () => [
      {
        name: survey?.data?.name,
        href: (projectRoutePath.SURVEY, { projectId: params?.id }),
      },
      {
        name: survey?.data?.name,
        href: generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
          projectId: params.projectId,
          sureveyId: params.detailId,
        }),
      },
      {
        name: 'Action History',
        href: '',
      },
    ],
    [params, survey, title],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <div>{t('common.actionHistory')}</div>
    </>
  );
}

export default ActionHistory;
