import { useGetProjectByIdQuery } from '@pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import {
  projectSurveyParams,
  SurveyForm,
  useGetSurveyById,
} from '@pages/Survey';
import { EditSurveyWrapper } from './style';
import { IBreadcrumbItem } from '@commonCom/StyledBreadcrumb';
import ProjectHeader from '@pages/Project/ProjectContent/components/Header/Header';
import { ROUTE_PATH } from '@/enums';

function EditSurvey() {
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();

  const { project } = useGetProjectByIdQuery(params.projectId);
  const { currentSurveyVersion } = useGetSurveyById(params.surveyId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: currentSurveyVersion?.name || '...',
        href: generatePath(
          `${ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT}?version=${currentSurveyVersion?.displayId}`,
          {
            projectId: params?.projectId,
            surveyId: params?.surveyId,
          },
        ),
      },
      {
        name: t('common.editSurvey'),
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
      },
    ],
    [params, currentSurveyVersion, project, t],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <EditSurveyWrapper>
        <SurveyForm />
      </EditSurveyWrapper>
    </>
  );
}

export default EditSurvey;
