import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { useGetProjectByIdQuery } from '@pages/Project';
import { TFunction, useTranslation } from 'react-i18next';
import { Button, Divider, Form, Modal, notification, Spin } from 'antd';
import { IModal, ProjectTypes } from '@/type';
import { Formik } from 'formik';
import { ControlledInput, PROJECT_FORM_SCHEMA } from '@/modules/common';
import { ProjectPayload } from '@/interfaces';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AdminService, ProjectService } from '@/services';
import { onError, transformEnumToOption } from '@/utils';
import { INPUT_TYPES } from '@input/type';
import { useSelector } from 'react-redux';
import _get from 'lodash/get';
import { AuthSelectors } from '@/redux/auth';

const defaultInitValues: ProjectPayload = {
  name: '',
  id: '',
  description: '',
  personInCharge: '',
  type: '',
};

interface IProjectModal extends IModal {
  mode: 'create' | 'view' | 'edit';
  projectId?: string;
}

const ProjectModal: FC<IProjectModal> = props => {
  const { open, toggleOpen, mode, projectId } = props;
  const { project, isLoading } = useGetProjectByIdQuery(projectId);
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const allRoles = useSelector(AuthSelectors.getAllRoles);

  const baseParams = useMemo(
    () => ({
      roles: Object.values(allRoles).map(elm => elm.id),
      selectAll: true,
      isDeleted: false,
    }),
    [allRoles],
  );

  const { data: teamMembers } = useQuery(
    'getAllTeamMembers',
    () => AdminService.getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onError,
    },
  );

  const optionsList = useMemo(
    () =>
      _get(teamMembers, 'data.data', []).map(elm => {
        return {
          label: `${elm.firstName || ''} ${elm.lastName || ''}`,
          value: elm.id,
        };
      }),
    [teamMembers],
  );

  const initValues = useMemo<ProjectPayload>(() => {
    if (mode === 'create') return defaultInitValues;
    return project;
  }, [mode, project]);

  const mutationCreateProject = useMutation(ProjectService.createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProjects');
      notification.success({ message: t('common.createSuccess') });
      toggleOpen();
    },
    onError,
  });
  const mutationEditProject = useMutation(ProjectService.updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProjectById');
      queryClient.invalidateQueries('getProjects');
      notification.success({ message: t('common.updateSuccess') });
      toggleOpen();
    },
    onError,
  });

  const onFinish = useCallback(
    (payload: ProjectPayload) => {
      if (mode === 'create') {
        mutationCreateProject.mutateAsync(payload);
        return;
      }
      if (mode === 'edit') {
        mutationEditProject.mutateAsync({
          ...payload,
          // type: project.type,
        });
      }
    },
    [mode, mutationCreateProject, mutationEditProject],
  );
  return (
    <>
      <Modal
        title={renderTitle(mode, t)}
        open={open}
        onCancel={toggleOpen}
        width={488}
        footer={renderFooter(mode, t)}
      >
        <Spin
          spinning={
            isLoading ||
            mutationCreateProject.isLoading ||
            mutationEditProject.isLoading
          }
        >
          <Formik
            enableReinitialize={true}
            initialValues={initValues}
            onSubmit={onFinish}
            validationSchema={PROJECT_FORM_SCHEMA}
          >
            {({ handleSubmit }) => (
              <Form
                id="changeEmailForm"
                layout={'vertical'}
                onFinish={handleSubmit}
                requiredMark={true}
              >
                <div>
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    name="name"
                    label={t('common.title')}
                    aria-label={'name'}
                    className={mode === 'view' ? 'view-mode' : undefined}
                  />
                  <ControlledInput
                    className={mode === 'view' ? 'view-mode' : undefined}
                    inputType={INPUT_TYPES.SELECT}
                    name="type"
                    aria-label={'type'}
                    label={t('common.projectType')}
                    disabled={mode === 'edit'}
                    options={transformEnumToOption(ProjectTypes, type =>
                      t(`projectType.${type}`),
                    )}
                  />
                  <ControlledInput
                    className={mode === 'view' ? 'view-mode' : undefined}
                    inputType={INPUT_TYPES.TEXTAREA}
                    name="description"
                    aria-label={'description'}
                    label={t('common.description')}
                  />

                  <Divider />

                  {mode === 'edit' && (
                    <ControlledInput
                      inputType={INPUT_TYPES.INPUT}
                      name="displayId"
                      aria-label="displayId"
                      label="ID"
                      disabled
                    />
                  )}
                  <ControlledInput
                    className={mode === 'view' ? 'view-mode' : undefined}
                    inputType={INPUT_TYPES.SELECT}
                    name="personInCharge"
                    aria-label={'personInCharge'}
                    label={t('common.personInCharge')}
                    options={optionsList}
                    loading={!optionsList}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Spin>
      </Modal>
    </>
  );
};

export default ProjectModal;

const renderTitle = (
  mode: IProjectModal['mode'],
  t: TFunction<'translation', undefined>,
): string => {
  if (mode === 'view') return t('common.projectInfo');
  if (mode === 'create') return t('common.addNewProject');
  return t('common.editProject');
};

const renderFooter = (
  mode: IProjectModal['mode'],
  t: TFunction<'translation', undefined>,
): ReactNode | false => {
  if (mode === 'view') return false;

  return (
    <Button
      size={'large'}
      className="secondary-btn"
      type="primary"
      htmlType="submit"
      form="changeEmailForm"
    >
      {mode === 'create' ? t('common.createProject') : t('common.saveEdits')}
    </Button>
  );
};
