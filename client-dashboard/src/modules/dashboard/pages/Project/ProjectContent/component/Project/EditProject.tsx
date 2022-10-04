import { Button, Form, notification } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { UpdateProject } from 'interfaces/project';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import { mockSurveyList } from '../../../mockup';
import ProjectHeader from '../Header';
import Inputs from './Inputs';
import { AddProjectWrapper } from './styles';

function EditProject() {
  const params = useParams();
  const { search } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: queryData, isLoading } = useQuery(['project', params.id], () =>
    ProjectService.getProjectById(params.id),
  );

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);

  const initialValues: UpdateProject = useMemo(() => {
    return {
      name: project?.name,
      id: project?.project?.displayId,
      description: project?.remark,
      personInCharge: project?.createdBy.fullName,
    };
  }, [project]);

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
        name: 'Edit Project',
        href: '',
      },
    ],
    [params, project],
  );

  const mutationEditProject = useMutation(ProjectService.updateProject, {
    onSuccess: () =>
      notification.success({ message: t('common.updateSuccess') }),
  });

  const handleSubmit = (payload: UpdateProject) => {
    mutationEditProject.mutateAsync(payload);
  };

  const fakeHandleSubmit = (payload: UpdateProject) => {
    notification.success({ message: t('common.updateSuccess') });
    navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
  };

  return (
    <>
      <ProjectHeader routes={routes} />
      {/* <Spin spinning={isLoading}> */}
      <AddProjectWrapper>
        <Formik
          // initialValues={project?.data || initialValues}
          initialValues={initialValues}
          onSubmit={fakeHandleSubmit}
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
      {/* </Spin> */}
    </>
  );
}

export default EditProject;
