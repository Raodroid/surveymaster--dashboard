import { Button, Form, Modal, notification, Spin } from 'antd';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { UserService } from 'services';
import { ModalStyled, SetUpPreferencesModalStyled } from './styles';

interface Modal {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

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

function SetUpPreferencesModal(props: Modal) {
  const { showModal, setShowModal } = props;
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const initialValues = useMemo<IInitialValues>(
    () => ({
      disabledNotificationTypes: reverseNotificationTypeValue(
        // myProfile.disabledNotificationTypes || [],
        [],
      ),
    }),
    [],
    // [myProfile.disabledNotificationTypes],
  );

  const mutationSetupEmailNoti = { isLoading: false };
  // const mutationSetupEmailNoti = useMutation(
  //   (value: NotificationType[]) =>
  //     UserService.setEmailNoti({
  //       id: myProfile.id as string,
  //       disabledNotificationTypes: value,
  //     }),
  //   {
  //     onSuccess: () => {
  //       notification.success({
  //         message: 'Update Success',
  //       });
  //       setShowModal(false);
  //       queryClient.invalidateQueries('getMe');
  //     },
  //     onError,
  //   },
  // );

  const handleSubmit = useCallback(
    async value => {
      // const reverseValue = reverseNotificationTypeValue(
      //   value.disabledNotificationTypes,
      // );
      // if (!isValueSame(reverseValue, myProfile.disabledNotificationTypes)) {
      //   await mutationSetupEmailNoti.mutateAsync(reverseValue);
      // } else {
      //   notification.success({
      //     message: t('common.updateSuccess'),
      //   });
      //   history.push(ROUTE_PATH.USER_DASHBOARD_PATHS.PROFILE.ROOT);
      // }
    },
    [],
    // [mutationSetupEmailNoti, myProfile.disabledNotificationTypes],
  );

  return (
    <SetUpPreferencesModalStyled
      title={t('common.setUpNotificationPreferences')}
      destroyOnClose={true}
      visible={showModal}
      width={500}
      footer={null}
      onCancel={() => setShowModal(false)}
      centered
    >
      <Spin spinning={mutationSetupEmailNoti.isLoading}>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          render={({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit} requiredMark={true}>
              <ControlledInput
                inputType={INPUT_TYPES.CHECKBOX_GROUP}
                name={'disabledNotificationTypes'}
                className="custom-group-checkbox"
                options={Object.keys(NotificationType)
                  .filter(
                    item =>
                      item !== NotificationType.CANCEL_BOOKING_HEALTH_COACH,
                  )
                  .map(key => ({
                    value: key,
                    label: t(`notification.notificationType.${key}`),
                  }))}
              />
              <Button type="primary" htmlType="submit" className="submit-btn">
                {t('common.saveChange')}
              </Button>
            </Form>
          )}
        />
      </Spin>
    </SetUpPreferencesModalStyled>
  );
}

export default SetUpPreferencesModal;
