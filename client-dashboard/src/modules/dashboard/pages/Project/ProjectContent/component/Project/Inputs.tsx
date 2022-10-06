import { Divider } from 'antd';
import { t } from 'i18next';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AddProjectContentWrapper, InputsWrapper } from './styles';

function Inputs() {
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
    <InputsWrapper>
      <div className="title mainInfo-title">{t('common.mainInformation')}:</div>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="name"
        label="Project Title"
        className="projTitle"
      />
      <ControlledInput
        inputType={INPUT_TYPES.TEXTAREA}
        name="description"
        label="Project Description"
        className="projDesc"
      />

      <Divider type="vertical" className="divider" />

      <div className="title projParams">{t('common.projectParameters')}:</div>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="id"
        label="ID"
        className="projId"
        disabled
      />
      <ControlledInput
        inputType={INPUT_TYPES.SELECT}
        name="roles"
        label="Person In Charge"
        className="personInCharge"
        options={optionsList}
        mode="multiple"
      />
    </InputsWrapper>
  );
}
export default Inputs;
