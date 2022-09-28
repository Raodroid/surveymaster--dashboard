import { Button, Form } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { FORGOT_PASSWORD_FIELD } from 'modules/common/validate/validate';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { ChangePasswordPayload, UserAction } from 'redux/user';
import * as Yup from 'yup';
import { ProfileModal } from '.';
import { ChangePasswordModalStyled } from './styles';

const initialValues = {
  currentPassword: '',
  password: '',
  verifyPassword: '',
};

function ChangePasswordModal(props: ProfileModal) {
  const { showModal, setShowModal } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ResetPasswordSchema = Yup.object().shape(FORGOT_PASSWORD_FIELD);
  const isResettingPasswordForm = useSelector(
    AuthSelectors.getIsResettingPassword,
  );
  const onFinish = (values: ChangePasswordPayload) => {
    dispatch(
      UserAction.changePassword(values, () => {
        setShowModal(false);
      }),
    );
  };

  return (
    <ChangePasswordModalStyled
      open={showModal}
      destroyOnClose
      footer={false}
      onCancel={() => setShowModal(false)}
      width={MODAL_WIDTH.SMALL}
      centered
      title="Change Password"
      closeIcon={<CloseIcon />}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ResetPasswordSchema}
        onSubmit={onFinish}
      >
        {({ handleSubmit, errors }) => {
          return (
            <Form layout="vertical" onFinish={handleSubmit}>
              <ControlledInput
                inputType={INPUT_TYPES.PASSWORD}
                type={'password'}
                name="currentPassword"
                label="Old Password"
              />
              <ControlledInput
                inputType={INPUT_TYPES.PASSWORD}
                type={'password'}
                name="password"
                label="New Password"
              />
              <ControlledInput
                inputType={INPUT_TYPES.PASSWORD}
                type={'password'}
                name="verifyPassword"
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
          );
        }}
      </Formik>
    </ChangePasswordModalStyled>
  );
}

export default ChangePasswordModal;
