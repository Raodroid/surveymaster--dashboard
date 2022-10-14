import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import ProjectHeader from '../Header';
import { AddSurveyWrapper } from './styles';
import SurveyForm from '../SurveyForm/SurveyForm'
import {
  projectRoutePath,
} from '../../../util';

function AddSurvey() {
  const params = useParams();
  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: 'title',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: 'Add New Survey',
        href: projectRoutePath.ADD_NEW_SURVEY,
      },
    ],
    [params],
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
