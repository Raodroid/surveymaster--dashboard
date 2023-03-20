import { Button, Form, notification } from 'antd';
import { SCOPE_CONFIG } from 'enums';
import { Formik } from 'formik';
import { ProjectPayload } from 'interfaces/project';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import { onError } from 'utils/funcs';
import { PROJECT_FORM_SCHEMA } from '../../../../../../common/validate/validate';
import { projectRoutePath, useGetProjectByIdQuery } from '../../../util';
import ProjectHeader from '../Header';
import Inputs from './ProjectInputs';
import { AddProjectWrapper, EditProjectWrapper } from './styles';

function EditProject() {
  const params = useParams<{ projectId?: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.PROJECTS,
  );

  const { project, isLoading } = useGetProjectByIdQuery(params?.projectId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: t('common.projectDescription'),
        href: projectRoutePath.PROJECT.EDIT,
      },
    ],
    [params?.projectId, project.name, t],
  );

  const mutationEditProject = useMutation(ProjectService.updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProjectById');
      queryClient.invalidateQueries('getProjects');
      notification.success({ message: t('common.updateSuccess') });
      navigate(projectRoutePath.ROOT);
    },
    onError,
  });

  const handleSubmit = (payload: ProjectPayload) => {
    mutationEditProject.mutateAsync({
      ...payload,
      type: project.type,
    });
  };

  const initialValues = useMemo(() => project, [project]);

  return (
    <EditProjectWrapper className="flex-column">
      {canUpdate && (
        <>
          <ProjectHeader routes={routes} />
          <CustomSpinSuspense spinning={isLoading}>
            <AddProjectWrapper>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={PROJECT_FORM_SCHEMA}
              >
                {({ handleSubmit: handleFinish }) => (
                  <Form
                    layout="vertical"
                    className="flex-column"
                    onFinish={handleFinish}
                  >
                    <Inputs />
                    <div className="footer">
                      <Button
                        type="primary"
                        className="info-btn"
                        htmlType="submit"
                        loading={mutationEditProject.isLoading}
                      >
                        {t('common.saveEdits')}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </AddProjectWrapper>
          </CustomSpinSuspense>
        </>
      )}
    </EditProjectWrapper>
  );
}

export default EditProject;
