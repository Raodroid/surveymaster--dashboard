import React, { FC } from 'react';
import { IOptionItem } from '@/type';
import { Radio } from 'antd';
import styled from 'styled-components/macro';
import { RadioGroupProps } from 'antd/lib/radio';

const CustomTab: FC<{ options: IOptionItem[] } & RadioGroupProps> = props => {
  const { options, ...rest } = props;
  return (
    <CustomTabWrapper
      size={'large'}
      optionType="button"
      buttonStyle="solid"
      className={'w-full flex'}
      {...rest}
    >
      {options.map((i, idx) => (
        <Radio.Button
          key={i.value}
          value={i.value}
          className={`flex-1 text-center ${
            idx === 0
              ? '!border-l-0'
              : idx === options.length - 1
              ? 'border-r-0'
              : ''
          }`}
        >
          {i.label}
        </Radio.Button>
      ))}
    </CustomTabWrapper>
  );
};

export default CustomTab;

const CustomTabWrapper = styled(Radio.Group)`
  &.ant-radio-group-solid {
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
      color: var(--text-color);
      background: white;
      border-color: #fceff7;
      &:before {
        background-color: #d9d9d9;
      }
    }
  }
  .ant-radio-button-wrapper:not(:first-child):before {
    background-color: #d9d9d9;
    left: 0;
  }
  .ant-radio-button-wrapper {
    background: #f6f6f9;
    border-color: #fceff7;
    border-width: 1px 0 1px 0;
  }
`;
