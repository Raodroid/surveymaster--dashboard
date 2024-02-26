import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllRoles } from '@pages/Profile';

function InviteMemberInputs(props: { edit: boolean }) {
  const { edit } = props;
  const { t } = useTranslation();

  const { data, isLoading } = useGetAllRoles();
  const optionsList = useMemo(() => {
    return Object.values(data).map(elm => {
      return {
        label: elm.name,
        value: elm.id,
      };
    });
  }, [data]);

  return (
    <>
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
        loading={isLoading}
        mode="multiple"
        inputType={INPUT_TYPES.SELECT}
        type={'text'}
        name="roles"
        optionFilterProp="label"
        label={t('common.authentication')}
        options={optionsList}
      />
    </>
  );
}

export default InviteMemberInputs;
