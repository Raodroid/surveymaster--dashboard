import { Button, Divider, Form, notification } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { CreateProject } from 'interfaces';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useParams } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import ProjectHeader from '../Header';
import { AddProjectContentWrapper, AddProjectWrapper } from './styles';
import * as Yup from 'yup';
import Inputs from './Inputs';
import { useLocation } from 'react-router';

const initialValues: CreateProject = {
  name: '',
  id: '',
  description: '',
  personInCharge: '',
};

function EditProject() {
  const params = useParams();
  const { search } = useLocation();
  const { t } = useTranslation();

  const title = useMemo(
    () => search.replace('?title=', '').replace('%20', ' '),
    [search],
  );

  const routes = useMemo(
    () => [
      {
        name: title,
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + params.id,
      },
      {
        name: 'Edit New Project',
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + params.id,
      },
    ],
    [title, params.id],
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

  return (
    <>
      <ProjectHeader routes={routes} />
      <AddProjectWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
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
                  Save Edits
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </AddProjectWrapper>
    </>
  );
}

export default EditProject;
