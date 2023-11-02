import { Button, Form, notification } from 'antd';
import { SCOPE_CONFIG } from 'enums';
import { Formik } from 'formik';
import { ProjectPayload } from 'interfaces/project';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import { onError } from 'utils/funcs';
import { PROJECT_FORM_SCHEMA } from '@/modules/common/validate/validate';
import { projectRoutePath } from '../../../util';
import ProjectHeader from '../Header';
import ProjectInputs from './ProjectInputs';
import { AddProjectWrapper } from './styles';
import { IBreadcrumbItem } from '@commonCom/StyledBreadcrumb';

const initialValues: ProjectPayload = {
  name: '',
  id: '',
  description: '',
  personInCharge: '',
  type: '',
};

function AddProject() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { canCreate } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECT);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: t('common.addNewProject'),
        href: projectRoutePath.PROJECT.ADD,
      },
    ],
    [t],
  );

  const mutationCreateProject = useMutation(ProjectService.createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProjects');
      queryClient.invalidateQueries('getAllProjects');
      notification.success({ message: t('common.createSuccess') });
      navigate(projectRoutePath.ROOT);
    },
    onError,
  });

  const handleSubmit = (payload: ProjectPayload) => {
    mutationCreateProject.mutateAsync(payload);
  };

  return (
    <>
      {canCreate && (
        <>
          <ProjectHeader routes={routes} />
          <AddProjectWrapper>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={PROJECT_FORM_SCHEMA}
            >
              {({ handleSubmit: handleFinish }) => (
                <Form layout="vertical" onFinish={handleFinish}>
                  <ProjectInputs />
                  <div className="footer">
                    <Button
                      type="primary"
                      className="info-btn"
                      htmlType="submit"
                      loading={mutationCreateProject.isLoading}
                    >
                      {t('common.saveProject')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </AddProjectWrapper>
        </>
      )}
    </>
  );
}

export default AddProject;
