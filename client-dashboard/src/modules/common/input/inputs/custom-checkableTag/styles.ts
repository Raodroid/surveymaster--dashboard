import styled from 'styled-components';
import CheckableTag from 'antd/lib/tag/CheckableTag';

export const CheckableTagCustomized = styled(CheckableTag)`
  &:hover {
    color: #fff !important;
    background: #292929;
    border-color: transparent !important;
    opacity: 1;
  }
`;
