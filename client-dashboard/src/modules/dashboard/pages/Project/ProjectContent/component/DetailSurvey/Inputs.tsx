import { Divider } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { InputsWrapper } from './styles';

function Inputs() {
  return (
    <InputsWrapper className="flex-aligns-start">
      <div className="main-info">
        <div className="title">Main Information:</div>
        <div className="flex wrapper">
          <ControlledInput
            name="name"
            label="Survey Title"
            inputType={INPUT_TYPES.INPUT}
          />
          <ControlledInput
            name="createdAt"
            label="Date Created"
            inputType={INPUT_TYPES.INPUT}
          />
        </div>
        <ControlledInput
          name="surveyRemarks"
          label="Survey Remarks"
          inputType={INPUT_TYPES.TEXTAREA}
        />
      </div>
      <div className="parameters">
        <div className="title">Main Information:</div>
        <ControlledInput
          name="id"
          label="ID"
          type="text"
          inputType={INPUT_TYPES.INPUT}
        />
      </div>
    </InputsWrapper>
  );
}

export default Inputs;
