import { Button, Form, notification, Spin } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { UpdateProject } from 'interfaces';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import * as Yup from 'yup';
import ProjectHeader from '../Header';
import Inputs from './Inputs';
import { AddProjectWrapper } from './styles';

const initialValues: UpdateProject = {
  name: '',
  id: '',
  description: '',
  personInCharge: '',
};

function EditProject() {
  const params = useParams();
  const { search } = useLocation();
  const { t } = useTranslation();

  const { data: project, isLoading } = useQuery(['project', params.id], () =>
    ProjectService.getProjectById(params.id),
  );

  const title = useMemo(
    () => search.replace('?title=', '').replace(/%20/g, ' '),
    [search],
  );

  const routes = useMemo(
    () => [
      {
        name: title,
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
      },
      {
        name: 'Edit Project',
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
      },
    ],
    [title],
  );

  const mutationEditProject = useMutation(ProjectService.updateProject, {
    onSuccess: () =>
      notification.success({ message: t('common.updateSuccess') }),
  });

  const handleSubmit = (payload: UpdateProject) => {
    mutationEditProject.mutateAsync(payload);
  };

  return (
    <>
      <ProjectHeader routes={routes} />
      <Spin spinning={isLoading}>
        <AddProjectWrapper>
          <Formik
            initialValues={project?.data || initialValues}
            onSubmit={handleSubmit}
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
                    loading={mutationEditProject.isLoading}
                  >
                    Save Edits
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </AddProjectWrapper>
      </Spin>
    </>
  );
}

export default EditProject;
