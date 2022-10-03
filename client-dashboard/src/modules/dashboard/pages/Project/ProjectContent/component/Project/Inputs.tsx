import { Divider } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { AddProjectContentWrapper } from './styles';

function Inputs() {
  return (
    <AddProjectContentWrapper>
      <div className="title mainInfo-title">Main Information:</div>
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

      <div className="title projParams">Project Parameters:</div>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="id"
        label="ID"
        className="projId"
      />
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="personInCharge"
        label="Person In Charge"
        className="personInCharge"
      />
    </AddProjectContentWrapper>
  );
}
export default Inputs;
