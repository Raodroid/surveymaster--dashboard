import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';

function InviteMemberInputs(props: { edit: boolean }) {
  const { edit } = props;
  const { t } = useTranslation();

  const allRoles = useSelector(AuthSelectors.getAllRoles);
  const optionsList = useMemo(() => {
    return Object.values(allRoles).map(elm => {
      return {
        label: elm.name,
        value: elm.id,
      };
    });
  }, [allRoles]);

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
        name="roles"
        label={t('common.authentication')}
        options={optionsList}
      />
    </>
  );
}

export default InviteMemberInputs;
