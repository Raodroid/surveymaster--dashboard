import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useTranslation } from 'react-i18next';
import { RemarkWrapper } from './styles';
import { memo } from 'react';

export interface RemarkProps {
  index?: number;
}

function Remark(props: RemarkProps) {
  const { index } = props;
  const { t } = useTranslation();
  return (
    <RemarkWrapper className="flex-column">
      <ControlledInput
        isFastField
        name={`questions[${index}].questionVersion.title`}
        inputType={INPUT_TYPES.INPUT}
        disabled
      />
      <strong>{t('common.remark')}</strong>
      <ControlledInput
        isFastField
        name={`questions[${index}].remark`}
        inputType={INPUT_TYPES.TEXTAREA}
        placeholder="Enter Remark"
      />
    </RemarkWrapper>
  );
}

export default memo(Remark);
