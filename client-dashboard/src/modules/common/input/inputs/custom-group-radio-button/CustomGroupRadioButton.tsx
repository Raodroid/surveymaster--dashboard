import React, { memo } from 'react';
import { Radio } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';
import { OnchangeType } from '../../type';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

export type CustomRadioButtonGroupProps = RadioGroupProps &
  OnchangeType & {
    customOptions?: Array<{
      label: React.ReactNode;
      value: CheckboxValueType;
      conditionCom: Element;
    }>;
    callback?: Function;
  };

const CustomGroupRadioButton = (props: CustomRadioButtonGroupProps) => {
  const { customOptions, options, callback, ...rest } = props;
  const customOnChange = e => {
    if (props.onChange) props.onChange(e.target.value);
  };
  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;

  return !customOptions ? (
    <Radio.Group {...props} {...customProps} />
  ) : (
    <Radio.Group {...rest} {...customProps}>
      {customOptions.map(option => (
        <Radio value={option.value}>
          <>
            {option.label}
            {props.value === option.value ? option.conditionCom : null}
          </>
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default memo(CustomGroupRadioButton);
