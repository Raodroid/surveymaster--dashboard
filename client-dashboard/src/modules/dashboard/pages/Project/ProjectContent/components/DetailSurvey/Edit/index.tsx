import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { projectRoutePath, useGetProjectByIdQuery } from 'modules/dashboard/pages/Project/util';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import { projectSurveyParams } from '..';
import ProjectHeader from '../../Header';
import { useGetSurveyById } from '../../Survey/util';
import SurveyForm from '../SurveyForm/SurveyForm';
import { EditSurveyWrapper } from './style';

function EditSurvey() {
  const params = useParams<projectSurveyParams>();

  const { project } = useGetProjectByIdQuery(params.projectId);
  const { surveyData: survey } = useGetSurveyById(params.surveyId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: survey.name || '...',
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
      <EditSurveyWrapper>
        <SurveyForm />
      </EditSurveyWrapper>
    </>
  );
}

export default EditSurvey;
