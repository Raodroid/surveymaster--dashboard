import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import { ViewSurveyWrapper } from './styles';
import SurveyForm from '../SurveyForm/SurveyForm';
import { projectRoutePath, useGetProjectByIdQuery } from '../../../../util';
import ProjectHeader from '../../Header';
import { projectSurveyParams } from '../index';
import { useGetSurveyById } from '../../Survey/util';

function ViewSurvey() {
  const params = useParams<projectSurveyParams>();

  const { project } = useGetProjectByIdQuery(params.projectId);
  const { surveyData } = useGetSurveyById(params.surveyId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: surveyData?.name || '...',
        href: projectRoutePath.DETAIL_SURVEY.ROOT,
      },
    ],
    [params?.projectId, project.name, surveyData?.name],
  );

  const links: string[] = [
    generatePath(projectRoutePath.DETAIL_SURVEY.EDIT, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),

    generatePath(projectRoutePath.DETAIL_SURVEY.HISTORY, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),

    generatePath(projectRoutePath.DETAIL_SURVEY.REMARKS, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),
  ];

  return (
    <>
      <ProjectHeader routes={routes} links={links} />

      <ViewSurveyWrapper>
        <SurveyForm />
      </ViewSurveyWrapper>
    </>
  );
}

export default ViewSurvey;
