import styled from 'styled-components';

export const DisplayAnswerWrapper = styled.div`
  tr.padding-top {
    td {
      padding-top: 2rem;
    }
    .question-cell {
      transform: translateY(-1rem);
    }
  }
  .DisplayAnswerWrapper {
    &__footer {
      margin-top: 1rem;
      display: flex;
      gap: 1.5rem;
      > * {
        flex: 1;
      }
      .ant-upload-select,
      .ant-btn {
        width: 100%;
      }
    }
  }

  .ant-upload-list-text {
    display: none;
  }
  .ant-table-expanded-row {
    transform: translateX(-4px);
  }

  tr:has(td .empty-expanded) {
    display: none;
  }
`;
