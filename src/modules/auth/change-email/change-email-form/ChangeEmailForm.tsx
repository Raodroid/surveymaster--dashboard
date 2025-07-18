import { FC, useCallback } from 'react';
import { Button, Form, notification } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction, AuthSelectors } from 'redux/auth';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { CHANGE_EMAIL_FIELD } from 'modules/common/validate/validate';
import Modal from 'antd/lib/modal/Modal';
import { useMutation } from 'react-query';
import { AuthService, CognitoService } from 'services';

export interface changeEmailPayload {
  oldEmail: string;
  newEmail: string;
  password: string;
}
export interface checkPasswordPayload {
  username: string;
  password: string;
}
const initialValues: {
  email: string;
  password: string;
  verifyPassword: string;
} = {
  email: '',
  password: '',
  verifyPassword: '',
};

const changeEmailSchema = Yup.object().shape(CHANGE_EMAIL_FIELD);
interface Props {
  isShowModal: boolean;
  setIsShowModal: (input: boolean) => void;
}

const ChangeEmailForm: FC<Props> = props => {
  const { isShowModal, setIsShowModal } = props;

  const { t } = useTranslation();
  const authProfile = useSelector(AuthSelectors.getProfile);
  const dispatch = useDispatch();

  const changeEmail = useCallback((payload: changeEmailPayload) => {
    return AuthService.changeEmail(payload);
  }, []);
  const logOut = () => {
    dispatch(AuthAction.userSignOut(true));
    // history.push(ROUTE_PATH.LOGIN);
  };

  const checkPassword = (payload: changeEmailPayload) => {
    const newPayload: checkPasswordPayload = {
      username: payload.oldEmail,
      password: payload.password,
    };
    return CognitoService.signInByCognito(
      newPayload.username,
      newPayload.password,
    );
  };
  const changeEmailMutation = useMutation(changeEmail, {
    onSuccess: () => {
      notification.success({
        message: t('common.changeEmailSuccess'),
      });
      logOut();
    },
    onError: (error: any) => {
      notification.error({
        message: `${t('common.changeEmailFail')}: ${
          error.response?.data?.message
        }`,
      });
    },
  });

  const checkPasswordMutation = useMutation(checkPassword, {
    onSuccess: (_, payload) => {
      changeEmailMutation.mutateAsync(payload);
    },
    onError: (error: any) => {
      notification.error({
        message: 'Password incorrect. Please check it again',
      });
    },
  });
  const closeModal = useCallback(() => setIsShowModal(false), [setIsShowModal]);

  const onFinish = useCallback(
    async values => {
      const payload = {
        oldEmail: authProfile?.email || '',
        newEmail: values?.email,
        password: values.password,
      };
      await checkPasswordMutation.mutateAsync(payload);
    },
    [authProfile?.email, checkPasswordMutation],
  );
  return (
    <Modal
      title={t('common.changeYourEmail')}
      open={isShowModal}
      onCancel={closeModal}
      width={400}
      footer={
        <Button
          className="secondary-btn"
          type="primary"
          htmlType="submit"
          form="changeEmailForm"
          loading={
            changeEmailMutation.isLoading || checkPasswordMutation.isLoading
          }
        >
          {t('common.changeEmail')}
        </Button>
      }
    >
      <Formik
        onSubmit={onFinish}
        initialValues={initialValues}
        validationSchema={changeEmailSchema}
      >
        {({ handleSubmit }) => (
          <div className={'w-full'}>
            <Form
              id="changeEmailForm"
              layout={'vertical'}
              onFinish={handleSubmit}
              requiredMark
            >
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                type={'email'}
                name="email"
                placeholder={t('common.email')}
                label={t('common.enterYourNewEmail')}
                customFormProps={{ required: true }}
              />
              <ControlledInput
                inputType={INPUT_TYPES.PASSWORD}
                type={'password'}
                name="password"
                placeholder={t('common.password')}
                label={t('common.enterYourExistingPassword')}
                customFormProps={{ required: true }}
              />
              {/* <ControlledInput
                inputType={INPUT_TYPES.PASSWORD}
                type={'password'}
                name="verifyPassword"
                placeholder={t('common.retypePassword')}
                label={t('common.confirmYourNewPassword')}
                customFormProps={{ required: true }}
              /> */}
            </Form>
          </div>
        )}
      </Formik>
    </Modal>
  );
};

export default ChangeEmailForm;
