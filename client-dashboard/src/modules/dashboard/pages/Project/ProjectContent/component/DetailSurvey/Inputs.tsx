import { Divider } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputsWrapper } from './styles';

function Inputs(props: { disabled?: boolean; remarks?: boolean }) {
  const { disabled = false, remarks = false } = props;
  const { t } = useTranslation();
  return (
    <InputsWrapper>
      <div className="mainInfo-title title">{t('common.mainInformation')}:</div>
      <ControlledInput
        name="name"
        label="Survey Title"
        className="surveyTitle"
        disabled={disabled}
        inputType={INPUT_TYPES.INPUT}
      />
      {!remarks && (
        <ControlledInput
          name="createdAt"
          label="Date Created"
          disabled={disabled}
          inputType={INPUT_TYPES.INPUT}
        />
      )}
      {remarks && (
        <ControlledInput
          name="surveyRemarks"
          label="Survey Remarks"
          className="surveyRemarks"
          disabled={disabled}
          inputType={INPUT_TYPES.TEXTAREA}
        />
      )}

      <Divider type="vertical" className="divider" />

      <div className="title surveyParams">{t('common.surveyParameters')}:</div>
      <ControlledInput
        name="id"
        label="ID"
        type="text"
        className="surveyId"
        disabled
        inputType={INPUT_TYPES.INPUT}
      />
    </InputsWrapper>
  );
}

export default Inputs;
