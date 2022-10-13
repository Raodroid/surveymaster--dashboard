import {
  createProjectDetailLink,
  createProjectLink,
  getProjectTitle,
  projectRoutePath
} from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';

function EditSurvey(props: DetailSurveyProps) {
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
        name: survey?.data.name,
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
        name: 'Edit Survey',
        href: '',
      },
    ],
    [params, title, survey],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <div>{t('common.editSurvey')}</div>
    </>
  );
}

export default EditSurvey;
