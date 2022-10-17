import { Divider } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputsWrapper } from './styles';

function Inputs(props: { disabled?: boolean; hideRemarks?: boolean }) {
  const { disabled = false, hideRemarks = false } = props;
  const { t } = useTranslation();
  return (
    <InputsWrapper>
      <div className="mainInfo-title title">{t('common.mainInformation')}:</div>
      <>
        <ControlledInput
          name="name"
          label="Survey Title"
          className="surveyTitle"
          disabled={disabled}
          inputType={INPUT_TYPES.INPUT}
        />
        <ControlledInput
          name="createdAt"
          label="Date Created"
          disabled={disabled}
          inputType={INPUT_TYPES.INPUT}
        />
      </>
      {!hideRemarks && (
        <ControlledInput
          name="remark"
          label="Survey Remarks"
          className="surveyRemarks"
          disabled={disabled}
          inputType={INPUT_TYPES.TEXTAREA}
        />
      )}

      <Divider type="vertical" className="divider" />

      <div className="title surveyParams">{t('common.surveyParameters')}:</div>
      <ControlledInput
        name="displayId"
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
