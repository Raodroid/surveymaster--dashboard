import { Button, Divider, Form, notification, Spin } from 'antd';
import { ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import { Formik } from 'formik';
import { ProjectPayload } from 'interfaces/project';
import { IBreadcrumbItem } from '@commonCom/StyledBreadcrumb';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { generatePath, useNavigate, useParams } from 'react-router';
import { onError } from 'utils/funcs';
import { PROJECT_FORM_SCHEMA } from 'modules/common/validate/validate';
import ProjectHeader from '../Header/Header';
import Inputs from './ProjectInputs';
import { ProjectService } from '@/services';
import { useGetProjectByIdQuery } from '@pages/Project';
import { SimpleBarCustom } from '@/customize-components';

function EditProject() {
  const params = useParams<{ projectId?: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { canUpdate } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.PROJECT);

  const { project, isLoading } = useGetProjectByIdQuery(params?.projectId);

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: t('common.projectDescription'),
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.EDIT,
      },
    ],
    [params?.projectId, project.name, t],
  );

  const mutationEditProject = useMutation(ProjectService.updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProjectById');
      queryClient.invalidateQueries('getProjects');
      notification.success({ message: t('common.updateSuccess') });
      navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
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
    <>
      {canUpdate && (
        <>
          <ProjectHeader routes={routes} />
          <div className={'flex-1 p-8 overflow-hidden'}>
            <Spin spinning={isLoading || mutationEditProject.isLoading}>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={PROJECT_FORM_SCHEMA}
              >
                {({ handleSubmit: handleFinish }) => (
                  <Form
                    layout="vertical"
                    className={'h-full flex flex-col'}
                    onFinish={handleFinish}
                  >
                    <div className={'flex-1 overflow-hidden'}>
                      <SimpleBarCustom>
                        <Inputs />
                      </SimpleBarCustom>
                    </div>
                    <div className="w-full">
                      <Divider className={'m-0 mb-3'} />
                      <Button
                        type="primary"
                        className="info-btn w-full"
                        htmlType="submit"
                      >
                        {t('common.saveEdits')}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Spin>
          </div>
        </>
      )}
    </>
  );
}

export default EditProject;
