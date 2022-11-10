import styled from 'styled-components';

export const SurveyWrapper = styled.div<{ centerLastChild: boolean }>`
  height: 100%;
  .ant-table-thead .ant-table-cell:nth-last-child(2) {
    text-align: ${props => (props.centerLastChild ? 'center' : '')};
  }
`;

export const TableWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  .TableWrapper {
    &__body {
      padding: 1.5rem 1.5rem 0 1.5rem;
      height: 100%;
      overflow: scroll;
    }
  }

  .ant-pagination {
    margin-top: 10px;
    text-align: end;
  }
  .actions {
    gap: 4px;
    .three-dots,
    .ant-btn {
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      box-shadow: none;
      color: var(--ant-primary-color);
      &:hover {
        background: var(--ant-primary-color-deprecated-l-35);
      }
    }
  }
  .ant-table {
    padding: 20px 12px 0;
    width: 100%;
    a,
    .ant-table-cell div,
    span {
      font-size: 12px;
      color: var(--text-color);
    }

    .ant-table-cell .dots-container {
      color: var(--ant-primary-color);
    }
  }

  .ant-table-cell {
    padding: 0 10px;
  }
  .ant-table-row {
    cursor: pointer;
  }
`;
