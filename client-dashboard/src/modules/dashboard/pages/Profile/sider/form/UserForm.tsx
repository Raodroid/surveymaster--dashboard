import { Button, Form, notification } from 'antd';
import { Formik } from 'formik';
import { UserUpdatedDto } from 'interfaces';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction, AuthSelectors } from 'redux/auth';
import { UserService } from 'services';
import { onError } from 'utils';
import { UserFormWrapper } from '../../styles';

function UserForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const profile = useSelector(AuthSelectors.getProfile);

  const mutationUpdateProfile = useMutation(
    (payload: UserUpdatedDto) => {
      return UserService.updateProfile({
        ...payload,
        avatar: '',
        displayName: '',
        description: '',
      });
    },
    {
      onSuccess: res => {
        dispatch(AuthAction.getProfile());
        queryClient.invalidateQueries('me');
        notification.success({
          message: 'Success',
        });
      },
      onError: onError,
    },
  );

  return (
    // <CustomSpinSuspense spinning={isLoading}>
    <UserFormWrapper>
      {profile && (
        <Formik
          initialValues={profile}
          onSubmit={(userFormValues: UserUpdatedDto) =>
            mutationUpdateProfile.mutateAsync({ ...userFormValues })
          }
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => {
            return (
              <Form layout="vertical" onFinish={handleSubmit}>
                <div className="avatar">
                  <ControlledInput
                    inputType={INPUT_TYPES.IMAGE_UPLOAD}
                    name="avatar"
                    label={t('common.photo')}
                    className="custom-upload"
                    id="custom-upload-avatar"
                  />
                </div>
                <div className="buttons flex">
                  <Button className="info-btn">
                    <label
                      htmlFor="custom-upload-avatar"
                      className="flex-center"
                    >
                      {t('common.uploadNewPhoto')}
                    </label>
                  </Button>
                  <Button
                    className="info-btn"
                    onClick={() => setFieldValue('avatar', null)}
                  >
                    {t('common.removePhoto')}
                  </Button>
                </div>
                <div className="inputs-wrapper">
                  <div className="flex-space-between name-wrapper">
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
                  </div>
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    type={'text'}
                    name="displayName"
                    label={t('common.displayName')}
                  />
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    type={'text'}
                    name="scientificDegree"
                    label={t('common.scientificDegree')}
                  />
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    type={'tel'}
                    name="phone"
                    label={t('common.phoneNumber')}
                  />
                </div>
                <Button
                  type="primary"
                  className="submit-btn secondary-btn"
                  htmlType="submit"
                  loading={mutationUpdateProfile.isLoading}
                >
                  {t('common.saveEdits')}
                </Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </UserFormWrapper>
    // </CustomSpinSuspense>
  );
}

export default UserForm;
