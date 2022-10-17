import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { projectRoutePath } from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import { DetailSurveyProps, projectSurveyParams } from '..';
import ProjectHeader from '../../Header';

function EditSurvey(props: DetailSurveyProps) {
  const { surveyData: survey, projectData: project } = props;
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.data.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: survey?.data.name || '...',
        href: generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
          projectId: params?.projectId,
          surveyId: params?.surveyId,
        }),
      },
      {
        name: 'Edit Survey',
        href: projectRoutePath.DETAIL_SURVEY.EDIT,
      },
    ],
    [params, survey, project],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <div>{t('common.editSurvey')}</div>
    </>
  );
}

export default EditSurvey;
