import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AuthSelectors } from 'redux/auth';

export const useInviteMemberSchema = () => {
  const { t } = useTranslation();
  const inviteMemberSchema = Yup.object({
    firstName: Yup.string().required(t('validation.messages.required')).trim(),
    lastName: Yup.string().required(t('validation.messages.required')).trim(),
    email: Yup.string()
      .required(t('validation.messages.required'))
      .email(t('validation.messages.emailInvalid'))
      .trim(),
    departmentName: Yup.string()
      .required(t('validation.messages.required'))
      .trim(),
    userRoles: Yup.array().min(1, t('validation.messages.required')),
  });
  return { inviteMemberSchema };
};

function InviteMemberInputs(props: { edit: boolean }) {
  const { edit } = props;
  const { t } = useTranslation();

  const allRoles = useSelector(AuthSelectors.getAllRoles);
  const optionsList = useMemo(
    () =>
      Object.values(allRoles).map(elm => {
        return {
          label: elm.name,
          value: elm.id,
        };
      }),
    [allRoles],
  );

  return (
    <>
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
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        type={'text'}
        name="departmentName"
        label={t('common.departmentName')}
      />
      <ControlledInput
        mode="multiple"
        inputType={INPUT_TYPES.SELECT}
        type={'text'}
        name="userRoles"
        value={(_, record) => {
          console.log(_, record);
          const list = Object.values(allRoles).filter(elm =>
            record.userRoles?.some(el => el.roleId === elm.id),
          );
          return list;
        }}
        label={t('common.authentication')}
        options={optionsList}
      />
    </>
  );
}

export default InviteMemberInputs;
