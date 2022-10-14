import { projectRoutePath } from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import { DetailSurveyProps, projectSurveyParams } from '..';
import ProjectHeader from '../../Header';

function ActionHistory(props: DetailSurveyProps) {
  const { surveyData: survey, projectData: project } = props;
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();

  const routes = useMemo(
    () => [
      {
        name: project?.data.name || '...',
        href: (projectRoutePath.SURVEY, { projectId: params?.projectId }),
      },
      {
        name: survey?.data.name || '...',
        href: generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
          projectId: params.projectId,
          surveyId: params.surveyId,
        }),
      },
      {
        name: 'Action History',
        href: '',
      },
    ],
    [params, survey, project],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <div>{t('common.actionHistory')}</div>
    </>
  );
}

export default ActionHistory;
