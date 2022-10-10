import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { RemarkWrapper } from './styles';

export interface RemarkProps {
  index?: number;
}

function Remark(props: RemarkProps) {
  const { index } = props;
  return (
    <RemarkWrapper className="flex-column">
      <ControlledInput
        name={`surveyQuestions[${index}].id`}
        inputType={INPUT_TYPES.INPUT}
        disabled
      />
      <strong>Remark</strong>
      <ControlledInput
        name={`surveyQuestions[${index}].remark`}
        inputType={INPUT_TYPES.TEXTAREA}
        placeholder="Enter Remark"
      />
    </RemarkWrapper>
  );
}

export default Remark;
