import { Button, Form, notification, Spin } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { UserService } from 'services';
import { onError } from 'utils';
import { ProfileModal } from '.';
import { SetUpPreferencesModalStyled } from './styles';

interface IInitialValues {
  disabledNotificationTypes?: NotificationType[];
}

export enum NotificationType {
  BOOKING_HEALTH_COACH = 'BOOKING_HEALTH_COACH',
  CANCEL_BOOKING_HEALTH_COACH = 'CANCEL_BOOKING_HEALTH_COACH',
  CANCEL_SINGLE_HEALTH_COACH_SESSION = 'CANCEL_SINGLE_HEALTH_COACH_SESSION',
  RESCHEDULE_COACH_SESSION = 'RESCHEDULE_COACH_SESSION',
  REMINDER_BOOKING_SESSION = 'REMINDER_BOOKING_SESSION',
}

const isValueSame = (
  oldValue?: NotificationType[],
  newValue?: NotificationType[],
): boolean => {
  if (!oldValue) {
    return !!newValue;
  }
  if (!newValue) {
    return !!oldValue;
  }
  return (
    oldValue.length === newValue.length &&
    oldValue.every(oldItem => newValue.some(newItem => newItem === oldItem))
  );
};

const reverseNotificationTypeValue = (
  oldValues: NotificationType[],
): NotificationType[] => {
  return Object.keys(NotificationType).reduce(
    (res: NotificationType[], key) => {
      if (oldValues.some(value => value === key)) {
        return res;
      }
      res = [...res, NotificationType[key]];
      return res;
    },
    [],
  );
};

type SetUpPreferences = Omit<ProfileModal, 'userId'>;

function SetUpPreferencesModal(props: SetUpPreferences) {
  const { showModal, setShowModal } = props;
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const myProfile = useSelector(AuthSelectors.getProfile);

  const initialValues = useMemo<IInitialValues>(
    () => ({
      disabledNotificationTypes: reverseNotificationTypeValue(
        myProfile?.disabledNotificationTypes || [],
      ),
    }),
    [myProfile?.disabledNotificationTypes],
  );

  const mutationSetupEmailNoti = useMutation(
    (value: NotificationType[]) =>
      UserService.setEmailNoti({
        id: myProfile?.id as string,
        disabledNotificationTypes: value,
      }),
    {
      onSuccess: () => {
        notification.success({
          message: t('updateSuccess'),
        });
        setShowModal(false);
        queryClient.invalidateQueries('getMe');
      },
      onError,
    },
  );

  const handleSubmit = useCallback(
    async value => {
      const reverseValue = reverseNotificationTypeValue(
        value.disabledNotificationTypes,
      );
      if (!isValueSame(reverseValue, myProfile?.disabledNotificationTypes)) {
        await mutationSetupEmailNoti.mutateAsync(reverseValue);
      } else {
        notification.success({
          message: t('common.updateSuccess'),
        });
        setShowModal(false);
      }
    },
    [
      mutationSetupEmailNoti,
      myProfile?.disabledNotificationTypes,
      setShowModal,
      t,
    ],
  );

  return (
    <SetUpPreferencesModalStyled
      title={t('common.setUpNotificationPreferences')}
      destroyOnClose={true}
      visible={showModal}
      width={MODAL_WIDTH.MEDIUM}
      footer={null}
      onCancel={() => setShowModal(false)}
      centered
    >
      <Spin spinning={mutationSetupEmailNoti.isLoading}>
        <Formik onSubmit={handleSubmit} initialValues={initialValues}>
          {({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit} requiredMark={true}>
              <ControlledInput
                inputType={INPUT_TYPES.CHECKBOX_GROUP}
                name={'disabledNotificationTypes'}
                className="custom-group-checkbox"
                options={[
                  {
                    value: 1,
                    label: 'test',
                  },
                ]}
              />
              <Button
                type="primary"
                htmlType="submit"
                className="secondary-btn"
                loading={mutationSetupEmailNoti.isLoading}
                style={{ width: '100%' }}
              >
                {t('common.saveChange')}
              </Button>
            </Form>
          )}
        </Formik>
      </Spin>
    </SetUpPreferencesModalStyled>
  );
}

export default SetUpPreferencesModal;
