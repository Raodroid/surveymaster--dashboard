import { useParams } from 'react-router';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import { projectRoutePath } from '../../../util';
import ProjectHeader from '../Header';
import { AddSurveyWrapper } from './styles';
import AddSurveyForm from './AddSurveyForm/AddSurveyForm';
import { useMemo } from 'react';
import {
  projectRoutePath,
} from '../../../util';
import {  AddSurveyWrapper } from './styles';

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
        <AddSurveyForm />
      </AddSurveyWrapper>
    </>
  );
}

export default AddSurvey;
