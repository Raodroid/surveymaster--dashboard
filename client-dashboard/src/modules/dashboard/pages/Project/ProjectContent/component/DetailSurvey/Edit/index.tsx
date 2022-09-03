import { ROUTE_PATH } from 'enums';
import { mockSurveyList } from 'modules/dashboard/pages/Project/mockup';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import ProjectHeader from '../../Header';

function EditSurvey() {
  const params = useParams();
  const { pathname } = useLocation();

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);

  const survey = data.find(elm => elm.displayId === params.detailId);

  const routes = useMemo(
    () => [
      {
        name: project?.name,
        href:
          params &&
          params.id &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', params.id),
      },
      {
        name: survey?.project?.name,
        href: pathname.replace('/edit', ''),
      },
      {
        name: 'Edit Survey',
        href: '',
      },
    ],
    [project, params, pathname, survey],
  );

  return (
    <>
      <ProjectHeader routes={routes} />
      <div>Edit Survey</div>
    </>
  );
}

export default EditSurvey;
