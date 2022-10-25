import styled from 'styled-components';

export const CategoryDetailWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .CategoryDetail {
    &__body {
      padding: 1.5rem;
      height: 100%;
      overflow: scroll;
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
