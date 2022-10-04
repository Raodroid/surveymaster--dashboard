import { Button, Form, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { InviteMember, UpdateMember } from 'interfaces';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import * as Yup from 'yup';
import { ProfileModal } from '.';
import { onError } from '../../../../../../utils/funcs';
import { InviteMemberModalStyled } from './styles';
import { useMemo } from 'react';

const initialValues = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  displayName: '',
  roles: [],
  departmentName: '',
};

interface InviteModal extends ProfileModal {
  edit?: boolean;
  userData?: any;
}

function InviteMemberModal(props: InviteModal) {
  const { showModal, setShowModal, edit = false, userData = {} } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const allRoles = useSelector(AuthSelectors.getAllRoles);
  const optionsList = useMemo(
    () =>
      Object.values(allRoles).map(elm => {
        return {
          label: elm.name,
          value: elm.id,
        };
      }),
    [allRoles],
  );

  const userInit = useMemo(() => {
    return {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      displayName: userData.displayName,
      departmentName: userData.departmentName,
      roles: userData.roles,
    };
  }, [userData]);

  const InviteMemberSchema = Yup.object({
    firstName: Yup.string().required(t('validation.messages.required')).trim(),
    lastName: Yup.string().required(t('validation.messages.required')).trim(),
    email: Yup.string()
      .required(t('validation.messages.required'))
      .email(t('validation.messages.emailInvalid'))
      .trim(),
    departmentName: Yup.string()
      .required(t('validation.messages.required'))
      .trim(),
    roles: Yup.array().min(1, t('validation.messages.required')),
  });

  const createHandleStatus = useCallback(
    (successMessage: string, errorMessage?: string) => {
      return {
        onSuccess: () => {
          setShowModal(false);
          notification.success({ message: t(`common.${successMessage}`) });
          queryClient.invalidateQueries('getTeamMembers');
        },
        onError,
      };
    },
    [setShowModal, t, queryClient],
  );

  const mutationInviteMember = useMutation(
    (payload: InviteMember) => AdminService.inviteMember(payload),
    createHandleStatus('inviteSuccess'),
  );

  const mutationUpdateMember = useMutation(
    (payload: UpdateMember) => AdminService.updateMember(payload),
    createHandleStatus('updateSuccess'),
  );

  const handleFinish = (payload: InviteMember | UpdateMember) => {
    if (edit) {
      mutationUpdateMember.mutateAsync({ ...payload, id: userData.id });
    } else {
      mutationInviteMember.mutateAsync(payload);
    }
  };

  return (
    <InviteMemberModalStyled
      open={showModal}
      destroyOnClose
      footer={false}
      onCancel={() => setShowModal(false)}
      width={MODAL_WIDTH.SMALL}
      centered
      title={edit ? t('common.editPreferences') : t('common.inviteMember')}
      closeIcon={<CloseIcon />}
    >
      <>
        <Formik
          initialValues={edit ? userInit : initialValues}
          onSubmit={handleFinish}
          validationSchema={InviteMemberSchema}
        >
          {({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <div className="input-wrapper">
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'text'}
                  name="firstName"
                  label={t('common.firstName')}
                />
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'text'}
                  name="lastName"
                  label={t('common.lastName')}
                />
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'text'}
                  name="displayName"
                  label={t('common.displayName')}
                />
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'email'}
                  name="email"
                  disabled={edit}
                  label={t('common.email')}
                />
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'text'}
                  name="departmentName"
                  label={t('common.departmentName')}
                />
                <ControlledInput
                  mode="multiple"
                  inputType={INPUT_TYPES.SELECT}
                  type={'text'}
                  name="roles"
                  label={t('common.authentication')}
                  options={optionsList}
                />
              </div>
              <div className="flex-center footer">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-btn secondary-btn"
                  loading={
                    edit
                      ? mutationUpdateMember.isLoading
                      : mutationInviteMember.isLoading
                  }
                >
                  {edit ? t('common.saveEdits') : t('common.sendInvitation')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </>
    </InviteMemberModalStyled>
  );
}

export default InviteMemberModal;
