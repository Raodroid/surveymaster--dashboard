import { ROUTE_PATH } from 'enums';
import {
  createProjectDetailLink,
  createProjectLink,
  getProjectTitle,
  projectRoutePath,
} from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { mockSurveyList } from 'type';
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
        name: title,
        href:
          params &&
          params.id &&
          createProjectLink(projectRoutePath.SURVEY, params.id, title),
      },
      {
        name: survey?.data?.name,
        href:
          params &&
          params.id &&
          params.detailId &&
          createProjectDetailLink(
            projectRoutePath.DETAIL_SURVEY.ROOT,
            params.id,
            params.detailId,
            title,
          ),
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
