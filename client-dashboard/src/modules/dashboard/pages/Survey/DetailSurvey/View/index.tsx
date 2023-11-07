import { IBreadcrumbItem } from '@commonCom/StyledBreadcrumb';
import React, { FC, useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import { ViewSurveyWrapper } from './styles';
import { SurveyForm, useGetSurveyById } from '@pages/Survey';
import { useGetProjectByIdQuery } from '@pages/Project/util';
import { projectSurveyParams } from '../DetailSurvey';

import { Link } from 'react-router-dom';
import { ViewDetailSurveyDropDownMenuButton } from './ViewDetailSurveyDropDownBtn';
import { useToggle } from '@/utils';
import { ROUTE_PATH } from '@/enums';
import { Chat, Clock, PenFilled } from '@/icons';
import { Divider } from 'antd';
import { useParseQueryString } from '@/hooks';
import { QsParams } from '@/type';
import { ProjectHeader } from '@pages/Project';

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
        href: generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: currentSurveyVersion?.name || '...',
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
      },
    ],
    [params?.projectId, project.name, currentSurveyVersion?.name],
  );
  const [isCallingAPI, toggleIsCallingAPI] = useToggle();

  return (
    <>
      <ProjectHeader
        showAddProjectBtn
        routes={routes}
        RightMenu={<HeaderRightMenu params={params} />}
      />

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

const HeaderRightMenu: FC<{ params: Partial<projectSurveyParams> }> = props => {
  const { params } = props;
  const qsParams = useParseQueryString<QsParams>();

  const links: string[] = useMemo(() => {
    const paramMeter = {
      projectId: params.projectId,
      surveyId: params.surveyId,
    };
    const queryString = qsParams.q;
    return [
      generatePath(
        ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
        paramMeter,
      ) + queryString,

      generatePath(
        ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.HISTORY,
        paramMeter,
      ) + queryString,

      generatePath(
        ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.REMARKS,
        paramMeter,
      ) + queryString,
    ];
  }, [params.projectId, params.surveyId, qsParams.q]);

  return (
    <div className="wrapper flex-center">
      <Link to={links[0]} aria-label={'edit survey link'}>
        <PenFilled />
      </Link>

      <Divider type="vertical" style={{ height: 8, width: 1 }} />

      <Link to={links[1]} aria-label={'go to history survey link'}>
        <Clock />
      </Link>

      <Divider type="vertical" style={{ height: 8, width: 1 }} />

      <Link to={links[2]} aria-label={'edit remark survey link'}>
        <Chat />
      </Link>
    </div>
  );
};
