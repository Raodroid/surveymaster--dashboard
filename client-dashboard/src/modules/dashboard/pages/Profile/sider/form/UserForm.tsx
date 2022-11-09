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
import SimpleBar from 'simplebar-react';

function UserForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const profile = useSelector(AuthSelectors.getProfile);

  const mutationUpdateProfile = useMutation(
    (payload: UserUpdatedDto) => {
      return UserService.updateProfile({
        ...payload,
        avatar: (payload.avatar as any)?.response?.url,
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

  const handleSubmit = (userFormValues: UserUpdatedDto) => {
    mutationUpdateProfile.mutateAsync(userFormValues);
  };

  return (
    // <CustomSpinSuspense spinning={isLoading}>
    <UserFormWrapper className="user-form">
      {profile && (
        <Formik initialValues={profile} onSubmit={handleSubmit}>
          {({ handleSubmit: handleFinish, setFieldValue }) => {
            return (
              <Form layout="vertical" onFinish={handleFinish}>
                <div className="avatar">
                  <ControlledInput
                    moduleName="users"
                    subPath="avatar"
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
                  <SimpleBar style={{ maxHeight: '100%' }}>
                    <div className="flex-j-between name-wrapper">
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
                      name="departmentName"
                      label={t('common.departmentName')}
                    />
                    {/* <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    type={'tel'}
                    name="phone"
                    label={t('common.phoneNumber')}
                  /> */}
                  </SimpleBar>
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
