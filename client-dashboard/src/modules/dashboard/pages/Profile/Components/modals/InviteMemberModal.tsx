import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ChangePasswordPayload, UserAction } from 'redux/user';
import { ProfileModal } from '.';
import { InviteMemberModalStyled } from './styles';

const initialValues = {
  currentPassword: '',
  password: '',
  passwordConfirm: '',
};

interface InviteModal extends ProfileModal {
  edit?: boolean;
}

function InviteMemberModal(props: InviteModal) {
  const { showModal, setShowModal, edit = false } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // const isInvitingForm = useSelector(AuthSelectors.getIsResettingPassword);
  const onFinish = useCallback(
    (values: ChangePasswordPayload) => {
      dispatch(
        UserAction.changePassword(values, () => {
          setShowModal(false);
        }),
      );
    },
    [dispatch],
  );

  return (
    <InviteMemberModalStyled
      open={showModal}
      destroyOnClose
      footer={edit ? [<Button type="primary">Remove from Team</Button>] : false}
      onCancel={() => setShowModal(false)}
      width={360}
      centered
      title={edit ? t('common.editPreferences') : t('common.inviteMember')}
      closeIcon={<CloseIcon />}
    >
      <>
        <Formik initialValues={initialValues} onSubmit={onFinish}>
          {({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                type={'text'}
                name="name"
                label={t('common.name')}
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
                name="department"
                label={t('common.department')}
              />{' '}
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
                // loading={isResettingPasswordForm}
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
