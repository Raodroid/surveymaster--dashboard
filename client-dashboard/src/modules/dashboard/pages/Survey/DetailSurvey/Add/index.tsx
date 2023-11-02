import { IBreadcrumbItem } from '@commonCom/StyledBreadcrumb';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { AddSurveyWrapper } from './styles';
import { projectRoutePath, useGetProjectByIdQuery } from '@pages/Project/util';
import ProjectHeader from '../../../Project/ProjectContent/components/Header';
import { useTranslation } from 'react-i18next';
import { projectSurveyParams } from '../DetailSurvey';
import { SurveyForm } from '@pages/Survey';

function AddSurvey() {
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();

  const { project } = useGetProjectByIdQuery(params.projectId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.name || '...',
        href: projectRoutePath.SURVEY.replace(':projectId', project.id),
      },
      {
        name: t('common.addNewSurvey'),
        href: projectRoutePath.ADD_NEW_SURVEY,
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
