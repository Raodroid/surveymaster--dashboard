import { Button, Form, notification } from 'antd';
import { Formik } from 'formik';
import { ProjectPayload } from 'interfaces/project';
import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import { onError } from 'utils/funcs';
import * as Yup from 'yup';
import { projectRoutePath } from '../../../util';
import ProjectHeader from '../Header';
import Inputs from './Inputs';
import { AddProjectWrapper } from './styles';
import { PROJECT_FORM_SCHEMA } from '../../../../../../common/validate/validate';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { SCOPE_CONFIG } from 'enums';

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

  const { canCreate } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.USERS);

  useEffect(() => {
    if (!canCreate) navigate('/');
  }, [canCreate, navigate]);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: 'Add New Project',
        href: projectRoutePath.PROJECT.ADD,
      },
    ],
    [],
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
      <ProjectHeader routes={routes} />
      {canCreate ? (
        <AddProjectWrapper>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={PROJECT_FORM_SCHEMA}
          >
            {({ handleSubmit: handleFinish }) => (
              <Form layout="vertical" onFinish={handleFinish}>
                <Inputs />
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
      ) : null}
    </>
  );
}

export default AddProject;
