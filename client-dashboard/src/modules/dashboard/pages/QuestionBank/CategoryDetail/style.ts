import styled from 'styled-components';
import { Popover } from 'antd';

export const CategoryDetailWrapper = styled.div`
  overflow: scroll;
  .CategoryDetail {
    &__body {
      padding: 1.5rem;
      .ant-table-row {
        cursor: pointer;
        .ant-table-cell {
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
`;
export const QuestionTypePopover = styled.div`
  p {
    font-size: 12px;
  }
`;
