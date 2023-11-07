import { Button, Divider, Form, notification, Spin } from 'antd';
import { ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import { Formik } from 'formik';
import { ProjectPayload } from 'interfaces/project';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { onError } from 'utils/funcs';
import ProjectHeader from '../Header/Header';
import ProjectInputs from './ProjectInputs';
import { IBreadcrumbItem, PROJECT_FORM_SCHEMA } from '@/modules/common';
import { ProjectService } from '@/services';
import { SimpleBarCustom } from '@/customize-components';

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
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.ADD,
      },
    ],
    [t],
  );

  const mutationCreateProject = useMutation(ProjectService.createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProjects');
      queryClient.invalidateQueries('getAllProjects');
      notification.success({ message: t('common.createSuccess') });
      navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
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
          <div className={'flex-1 p-8 overflow-hidden'}>
            <Spin spinning={mutationCreateProject.isLoading}>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={PROJECT_FORM_SCHEMA}
              >
                {({ handleSubmit: handleFinish }) => (
                  <Form
                    layout="vertical"
                    onFinish={handleFinish}
                    className={'h-full flex flex-col'}
                  >
                    <div className={'flex-1 overflow-hidden'}>
                      <SimpleBarCustom>
                        <ProjectInputs />
                      </SimpleBarCustom>
                    </div>
                    <div className="w-full">
                      <Divider className={'m-0 mb-3'} />
                      <Button
                        type="primary"
                        className="info-btn w-full"
                        htmlType="submit"
                      >
                        {t('common.saveProject')}
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

export default AddProject;
