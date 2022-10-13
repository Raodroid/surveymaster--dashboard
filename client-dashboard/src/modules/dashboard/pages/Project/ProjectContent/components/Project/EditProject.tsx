import { Button, Form, notification } from 'antd';
import { Formik } from 'formik';
import { UpdateProject } from 'interfaces/project';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import ProjectService from 'services/survey-master-service/project.service';
import { onError } from 'utils/funcs';
import { projectRoutePath } from '../../../util';
import ProjectHeader from '../Header';
import Inputs from './Inputs';
import { AddProjectWrapper, EditProjectWrapper } from './styles';

function EditProject() {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: project, isLoading } = useQuery(
    ['getProject', params?.projectId],
    () => ProjectService.getProjectById(params?.projectId),
  );

  const routes = useMemo(
    () => [
      {
        name: project?.data?.name,
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: 'Edit Project',
        href: projectRoutePath.PROJECT.EDIT,
      },
    ],
    [params, project],
  );

  const mutationEditProject = useMutation(ProjectService.updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProject');
      queryClient.invalidateQueries('getProjects');
      notification.success({ message: t('common.updateSuccess') });
      navigate(projectRoutePath.ROOT);
    },
    onError,
  });

  const handleSubmit = (payload: UpdateProject) => {
    mutationEditProject.mutateAsync(payload);
  };

  const initialValues = useMemo(() => project?.data, [project]);

  return (
    <EditProjectWrapper className="flex-column">
      <ProjectHeader routes={routes} />
      <CustomSpinSuspense spinning={isLoading}>
        <AddProjectWrapper>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
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
    </EditProjectWrapper>
  );
}

export default EditProject;
