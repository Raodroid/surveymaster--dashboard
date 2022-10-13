import { projectRoutePath } from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';

function EditSurvey(props: DetailSurveyProps) {
  const { surveyData: survey } = props;
  const params = useParams();
  const { t } = useTranslation();

  const routes = useMemo(
    () => [
      {
        name: survey?.name,
        href: generatePath(projectRoutePath.SURVEY, { projectId: params?.id }),
      },
      {
        name: survey?.data.name,
        href: generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
          projectId: params?.id,
          surveyId: params?.surveyId,
        }),
      },
      {
        name: 'Edit Survey',
        href: projectRoutePath.DETAIL_SURVEY.EDIT,
      },
    ],
    [params, survey],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <div>{t('common.editSurvey')}</div>
    </>
  );
}

export default EditSurvey;
