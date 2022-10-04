import { Button, Form, notification } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { CreateProject } from 'interfaces/project';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import * as Yup from 'yup';
import ProjectHeader from '../Header';
import Inputs from './Inputs';
import { AddProjectWrapper } from './styles';

const initialValues: CreateProject = {
  name: '',
  id: '',
  description: '',
  personInCharge: '',
};

function AddProject() {
  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routes = useMemo(
    () => [
      {
        name: 'Add New Project',
        href: '',
      },
    ],
    [],
  );

  const createProjectSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    id: Yup.string(),
    description: Yup.string().required('Required!'),
    personInCharge: Yup.string().required('Required!'),
  });

  const mutationCreateProject = useMutation(ProjectService.createProject, {
    onSuccess: () =>
      notification.success({ message: t('common.createSuccess') }),
  });

  const handleSubmit = (payload: CreateProject) => {
    mutationCreateProject.mutateAsync(payload);
  };

  const fakeHandleSubmit = (payload: CreateProject) => {
    // notification.success({ message: 'Create Success' });
    navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
  };

  return (
    <>
      <ProjectHeader routes={routes} />
      <AddProjectWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={fakeHandleSubmit}
          validationSchema={createProjectSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit: handleFinish,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form layout="vertical" onFinish={handleFinish}>
              <Inputs />
              <div className="footer">
                <Button
                  type="primary"
                  className="info-btn"
                  htmlType="submit"
                  loading={mutationCreateProject.isLoading}
                >
                  Save Project
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </AddProjectWrapper>
    </>
  );
}

export default AddProject;
