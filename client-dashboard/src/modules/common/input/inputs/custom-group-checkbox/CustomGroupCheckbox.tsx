import React, { memo, ReactText, useCallback } from 'react';
import { Checkbox } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';
import { OnchangeType } from '../../type';
import { CustomGroupCheckboxWrapper } from './style';

import { CheckboxValueType } from 'antd/lib/checkbox/Group';

export interface ISurveyOption {
  id: string;
  internal_question_id: string;
  label: string;
  value: string | number;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isNoneOption?: boolean;
}
export type CustomRadioButtonGroupProps = RadioGroupProps &
  OnchangeType & {
    customOptions?: Array<{
      label: React.ReactNode;
      value: CheckboxValueType;
      conditionCom: Element;
    }>;
  };

const CustomGroupCheckbox = (props: CustomRadioButtonGroupProps) => {
  const customOnChange = useCallback(
    values => {
      if (!props.onChange) return;

      if (values.length < props.value.length) {
        props.onChange(values);
        return;
      }

      let transformValues: ReactText[] = values;

      if (props.options) {
        for (let i = 0; i < props.options?.length; i++) {
          const option = props.options[i] as ISurveyOption;
          if (!option.value || !option.id) break;

          if (!option.isNoneOption) continue;

          if (props.value.length === 1 && props.value[0] === option.value) {
            transformValues = transformValues.filter(
              value => value !== props.value[0],
            );
            break;
          }

          if (values.some(value => value === option.value)) {
            transformValues = [option.value];
            break;
          }
        }
      }
      props.onChange(transformValues);
    },
    [props],
  );
  const { customOptions, options, ...rest } = props;

  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;
  return (
    <CustomGroupCheckboxWrapper>
      {customOptions ? (
        <Checkbox.Group {...rest} {...customProps}>
          {customOptions.map(option => (
            <Checkbox key={String(option.value)} value={option.value}>
              <>
                {option.label}
                {(props.value || []).includes(option.value)
                  ? option.conditionCom
                  : null}
              </>
            </Checkbox>
          ))}
        </Checkbox.Group>
      ) : (
        <Checkbox.Group {...props} {...customProps} />
      )}
    </CustomGroupCheckboxWrapper>
  );
};

export default memo(CustomGroupCheckbox);
