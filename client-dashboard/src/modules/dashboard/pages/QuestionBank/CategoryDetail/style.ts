import styled from 'styled-components';
import { Popover } from 'antd';

export const CategoryDetailWrapper = styled.div`
  overflow: scroll;
  .CategoryDetail {
    &__body {
      padding: 1.5rem;
      .ant-table-row {
        cursor: pointer;
      }
    }
  }
`;
export const QuestionTypePopover = styled.div`
  p {
    font-size: 12px;
  }
`;
