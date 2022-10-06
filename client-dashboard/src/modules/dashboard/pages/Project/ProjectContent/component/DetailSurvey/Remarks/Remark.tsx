import Input from 'antd/lib/input/Input';
import { ControlledInput, UncontrolledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import UncontrollInput from 'modules/common/input/uncontrolled-input/UncontrollInput';
import React from 'react';
import { RemarkWrapper } from './styles';

export interface RemarkProps {
  index?: number;
}

function Remark(props: RemarkProps) {
  const { index } = props;
  return (
    <RemarkWrapper className="flex-column">
      <UncontrolledInput
        name={`questions[${index}].title`}
        inputType={INPUT_TYPES.INPUT}
        disabled
      />
      <strong>Remark</strong>
      <UncontrolledInput
        name={`questions[${index}].remark`}
        inputType={INPUT_TYPES.TEXTAREA}
        placeholder="Enter Remark"
      />
    </RemarkWrapper>
  );
}

export default Remark;
