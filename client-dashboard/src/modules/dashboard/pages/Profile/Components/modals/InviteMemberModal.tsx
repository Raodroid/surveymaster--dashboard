import { Button, Form, message, notification } from 'antd';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useTranslation } from 'react-i18next';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { InviteMemberPayload } from 'redux/user';
import { AdminService } from 'services';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { onError } from '../../../../../../utils/funcs';
import { InviteMemberModalStyled } from './styles';
import { ProfileModal } from '.';

const initialValues = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  displayName: '',
  scientificDegree: '',
  authentication: '',
};

interface InviteModal extends ProfileModal {
  edit?: boolean;
  userData?: any;
}

function InviteMemberModal(props: InviteModal) {
  const { showModal, setShowModal, edit = false, userData = {} } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const InviteMemberSchema = Yup.object({
    firstName: Yup.string().required('Required!').trim(),
    lastName: Yup.string().required('Required!').trim(),
    displayName: Yup.string().trim(),
    // displayName: Yup.string().required('Required!').trim(),
    email: Yup.string()
      .required('Required!')
      .email('Wrong email format!')
      .trim(),
    scientificDegree: Yup.string().trim(),
    authentication: Yup.string().trim(),
    // scientificDegree: Yup.string().required('Required!').trim(),
    // authentication: Yup.string().required('Required!').trim(),
  });

  const createHandleStatus = useCallback(
    (successMessage: string, errorMessage?: string) => {
      return {
        onSuccess: () => {
          setShowModal(false);
          notification.success({ message: t(`common.${successMessage}`) });
          queryClient.invalidateQueries('getStaffs');
        },
        onError,
      };
    },
    [setShowModal, t],
  );

  const mutationInviteMember = useMutation(
    (payload: InviteMemberPayload) => AdminService.inviteMember(payload),
    createHandleStatus('inviteSuccess'),
  );

  const mutationEditMember = useMutation(
    (payload: InviteMemberPayload) =>
      AdminService.editMemberPreferences({
        ...payload,
        id: payload.id,
      }),
    createHandleStatus('updateSuccess'),
  );

  const mutationRemoveFromTeam = useMutation(
    () => AdminService.removeMemberPreferences({ userId: userData.id }),
    createHandleStatus('removeSuccess'),
  );

  const onFinish = (payload: InviteMemberPayload) => {
    if (edit) {
      mutationEditMember.mutateAsync({ ...payload, id: userData.id });
    } else {
      mutationInviteMember.mutateAsync(payload);
    }
  };

  const handleRemoveMember = () => {
    mutationRemoveFromTeam.mutateAsync();
  };

  return (
    <InviteMemberModalStyled
      open={showModal}
      destroyOnClose
      footer={
        edit
          ? [
              <Button
                type="primary"
                onClick={handleRemoveMember}
                loading={mutationRemoveFromTeam.isLoading}
              >
                Remove from Team
              </Button>,
            ]
          : false
      }
      onCancel={() => setShowModal(false)}
      width={360}
      centered
      title={edit ? t('common.editPreferences') : t('common.inviteMember')}
      closeIcon={<CloseIcon />}
    >
      <>
        <Formik
          initialValues={
            edit
              ? {
                  id: userData.id,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  displayName: '',
                  scientificDegree: '',
                  authentication: '',
                }
              : initialValues
          }
          onSubmit={onFinish}
          validationSchema={InviteMemberSchema}
        >
          {({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
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
                label={t('common.email')}
              />
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                type={'text'}
                name="scientificDegree"
                label={t('common.scientificDegree')}
              />
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                type={'text'}
                name="authentication"
                label={t('common.authentication')}
              />
              <Button
                type="primary"
                htmlType="submit"
                className="submit-btn"
                loading={
                  edit
                    ? mutationEditMember.isLoading
                    : mutationInviteMember.isLoading
                }
              >
                {edit ? t('common.saveEdits') : t('common.sendInvitation')}
              </Button>
            </Form>
          )}
        </Formik>
      </>
    </InviteMemberModalStyled>
  );
}

export default InviteMemberModal;
