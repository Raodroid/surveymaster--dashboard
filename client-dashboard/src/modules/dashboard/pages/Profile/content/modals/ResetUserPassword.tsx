import { Button, Form, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import {
  passwordYup,
  verifyPasswordYup,
} from 'modules/common/validate/validate';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { ChangeUserPasswordPayload } from 'redux/user';
import { AdminService } from 'services';
import { onError } from 'utils';
import * as Yup from 'yup';
import { ProfileModal } from '.';
import { ChangePasswordModalStyled } from './styles';

interface ResetUserPasswordProps extends ProfileModal {
  userId: string;
}

function ResetUserPassword(props: ResetUserPasswordProps) {
  const { userId, showModal, setShowModal } = props;
  const { t } = useTranslation();

  const ResetUserPasswordSchema = Yup.object({
    password: passwordYup,
    passwordConfirmation: verifyPasswordYup,
  });

  const mutationChangeUserPassword = useMutation(
    (payload: ChangeUserPasswordPayload) => {
      return AdminService.resetUserPassword({
        userId: payload.userId,
        password: payload.password,
      });
    },
    {
      onSuccess: () => {
        setShowModal(false);
        notification.success({ message: t('common.updateSuccess') });
      },
      onError: (err: any) => {
        setShowModal(false);
        onError(err);
      },
    },
  );

  const onFinish = (payload: ChangeUserPasswordPayload) => {
    mutationChangeUserPassword.mutateAsync(payload);
  };

  const initialValues = useMemo(() => {
    return {
      userId: userId,
      password: '',
      passwordConfirmation: '',
    };
  }, [userId]);

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
        validationSchema={ResetUserPasswordSchema}
        onSubmit={onFinish}
      >
        {({ handleSubmit }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <ControlledInput
              inputType={INPUT_TYPES.PASSWORD}
              type={'password'}
              name="password"
              label="New Password"
            />
            <ControlledInput
              inputType={INPUT_TYPES.PASSWORD}
              type={'password'}
              name="passwordConfirmation"
              label="Confirm New Password"
            />
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
              loading={mutationChangeUserPassword.isLoading}
            >
              {t('common.sendConfirmation')}
            </Button>
          </Form>
        )}
      </Formik>
    </ChangePasswordModalStyled>
  );
}

export default ResetUserPassword;
