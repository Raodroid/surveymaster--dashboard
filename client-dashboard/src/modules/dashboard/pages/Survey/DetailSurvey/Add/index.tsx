import { IBreadcrumbItem } from '@commonCom/StyledBreadcrumb';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { AddSurveyWrapper } from './styles';
import { useGetProjectByIdQuery } from '@pages/Project/util';
import { useTranslation } from 'react-i18next';
import { projectSurveyParams } from '../DetailSurvey';
import { SurveyForm } from '@pages/Survey';
import { ROUTE_PATH } from '@/enums';
import { ProjectHeader } from '@pages/Project';

function AddSurvey() {
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();

  const { project } = useGetProjectByIdQuery(params.projectId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.name || '...',
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(
          ':projectId',
          project.id,
        ),
      },
      {
        name: t('common.addNewSurvey'),
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY,
      },
    ],
    [project?.name, project.id, t],
  );

  return (
    <>
      <ProjectHeader routes={routes} />

      <AddSurveyWrapper>
        <SurveyForm />
      </AddSurveyWrapper>
    </>
  );
}

export default AddSurvey;
