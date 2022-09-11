import { Button, Form, Modal } from 'antd';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { FORGOT_PASSWORD_FIELD } from 'modules/common/validate/validate';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { ChangePasswordPayload, UserAction } from 'redux/user';
import * as Yup from 'yup';
import { ChangePasswordModalStyled } from './styles';

interface Modal {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const initialValues = {
  currentPassword: '',
  password: '',
  passwordConfirm: '',
};

function ChangePasswordModal(props: Modal) {
  const { showModal, setShowModal } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ResetPasswordSchema = Yup.object().shape(FORGOT_PASSWORD_FIELD);
  const isResettingPasswordForm = useSelector(
    AuthSelectors.getIsResettingPassword,
  );
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
    <ChangePasswordModalStyled
      open={showModal}
      destroyOnClose
      footer={false}
      onCancel={() => setShowModal(false)}
      width={360}
      centered
      title="Change Password"
      closeIcon={<CloseIcon />}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ResetPasswordSchema}
        onSubmit={onFinish}
      >
        {({ handleSubmit }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <ControlledInput
              inputType={INPUT_TYPES.PASSWORD}
              type={'password'}
              name="password"
              label="Old Password"
            />
            <ControlledInput
              inputType={INPUT_TYPES.PASSWORD}
              type={'password'}
              name="newPassword"
              label="New Password"
            />
            <ControlledInput
              inputType={INPUT_TYPES.PASSWORD}
              type={'password'}
              name="confirmPassword"
              label="Confirm New Password"
            />
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
              loading={isResettingPasswordForm}
            >
              {t('common.sendConfirmation')}
            </Button>
          </Form>
        )}
      </Formik>
    </ChangePasswordModalStyled>
  );
}

export default ChangePasswordModal;
