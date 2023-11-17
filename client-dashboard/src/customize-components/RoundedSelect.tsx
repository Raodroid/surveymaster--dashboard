import React, { FC } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import styled from 'styled-components/macro';
import templateVariable from '@/app/template-variables.module.scss';

interface IRoundedSelect extends SelectProps<string | number> {
  color?: string;
}

const RoundedSelectWrapper: React.FunctionComponent<IRoundedSelect> = styled(
  Select,
)<IRoundedSelect>`
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 16px;
    border-color: ${p => (p.color ? p.color : templateVariable.primary_color)};
    color: ${p => (p.color ? p.color : templateVariable.primary_color)};
  }
  &.ant-select .ant-select-selector .ant-select-selection-item {
    color: inherit;
    font-weight: 600;
  }
  .ant-select-arrow .anticon > svg {
    display: none;
  }
  .ant-select-arrow .anticon:after {
    content: '';
    width: 11px;
    height: 6px;
    background-color: ${p =>
      p.color ? p.color : templateVariable.primary_color};
    -webkit-mask-image: url(/src/assets/Icons/Arrow-pink.svg);
    mask-image: url(/src/assets/Icons/Arrow-pink.svg);
  }
`;

const RoundedSelect: FC<IRoundedSelect> = props => {
  const { ...rest } = props;
  return <RoundedSelectWrapper {...rest} />;
};

export default RoundedSelect;
