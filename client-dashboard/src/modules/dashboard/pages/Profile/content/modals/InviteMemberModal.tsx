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
import { AdminService } from 'services';
import * as Yup from 'yup';
import { ProfileModal } from '.';
import { onError } from '../../../../../../utils/funcs';
import { InviteMemberModalStyled } from './styles';

const initialValues = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  displayName: '',
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
    email: Yup.string()
      .required('Required!')
      .email('Wrong email format!')
      .trim(),
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
          initialValues={
            edit
              ? {
                  id: userData.id,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  displayName: '',
                }
              : initialValues
          }
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
                {/* <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'text'}
                  name="authentication"
                  label={t('common.authentication')}
                /> */}
              </div>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-btn"
                loading={
                  edit
                    ? mutationUpdateMember.isLoading
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
