import { IBreadcrumbItem } from '@/modules/common/commonComponent/StyledBreadcrumb';
import { projectRoutePath, useGetProjectByIdQuery } from '@pages/Project/util';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import { projectSurveyParams } from '../index';
import ProjectHeader from '../../../Project/ProjectContent/components/Header';
import SurveyForm from '../../SurveyForm/SurveyForm';
import { EditSurveyWrapper } from './style';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';

function EditSurvey() {
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();

  const { project } = useGetProjectByIdQuery(params.projectId);
  const { currentSurveyVersion } = useGetSurveyById(params.surveyId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: currentSurveyVersion?.name || '...',
        href: generatePath(
          `${projectRoutePath.DETAIL_SURVEY.ROOT}?version=${currentSurveyVersion?.displayId}`,
          {
            projectId: params?.projectId,
            surveyId: params?.surveyId,
          },
        ),
      },
      {
        name: t('common.editSurvey'),
        href: projectRoutePath.DETAIL_SURVEY.EDIT,
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
