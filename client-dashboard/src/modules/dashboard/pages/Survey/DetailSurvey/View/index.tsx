import { IBreadcrumbItem } from '@/modules/common/commonComponent/StyledBreadcrumb';
import React, { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import { ViewSurveyWrapper } from './styles';
import SurveyForm from '../../SurveyForm/SurveyForm';
import { projectRoutePath, useGetProjectByIdQuery } from '@pages/Project/util';
import ProjectHeader from '../../../Project/ProjectContent/components/Header';
import { projectSurveyParams } from '../index';

import { useToggle } from '../../../../../../utils';
import { useLocation } from 'react-router-dom';
import { ViewDetailSurveyDropDownMenuButton } from './ViewDetailSurveyDropDownBtn';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';

function ViewSurvey() {
  const params = useParams<projectSurveyParams>();

  const { project } = useGetProjectByIdQuery(params.projectId);
  const { currentSurveyVersion, surveyData } = useGetSurveyById(
    params.surveyId,
  );

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
        href: projectRoutePath.DETAIL_SURVEY.ROOT,
      },
    ],
    [params?.projectId, project.name, currentSurveyVersion?.name],
  );

  const paramMeter = useMemo(
    () => ({
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),
    [params.projectId, params.surveyId],
  );

  const location = useLocation();
  const queryString = location.search;

  const links: string[] = useMemo(
    () => [
      generatePath(projectRoutePath.DETAIL_SURVEY.EDIT, paramMeter) +
        queryString,

      generatePath(projectRoutePath.DETAIL_SURVEY.HISTORY, paramMeter) +
        queryString,

      generatePath(projectRoutePath.DETAIL_SURVEY.REMARKS, paramMeter) +
        queryString,
    ],
    [paramMeter, queryString],
  );
  const [isCallingAPI, toggleIsCallingAPI] = useToggle();

  return (
    <>
      <ProjectHeader routes={routes} links={links} />

      <ViewSurveyWrapper>
        <div className={'version-section'}>
          {surveyData.versions?.map(ver => (
            <ViewDetailSurveyDropDownMenuButton
              key={ver.id}
              surveyVersion={ver}
              callbackLoading={toggleIsCallingAPI}
            />
          ))}
        </div>
        <SurveyForm isLoading={isCallingAPI} />
      </ViewSurveyWrapper>
    </>
  );
}

export default ViewSurvey;
