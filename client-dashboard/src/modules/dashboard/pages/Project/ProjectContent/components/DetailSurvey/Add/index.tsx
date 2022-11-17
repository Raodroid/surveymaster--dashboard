import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';
import { AddSurveyWrapper } from './styles';
import SurveyForm from '../SurveyForm/SurveyForm';
import { projectRoutePath } from '../../../../util';
import ProjectHeader from '../../Header';
import { useTranslation } from 'react-i18next';

function AddSurvey() {
  const params = useParams();
  const { t } = useTranslation();

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: 'title',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: t('common.addNewSurvey'),
        href: projectRoutePath.ADD_NEW_SURVEY,
      },
    ],
    [params, t],
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
