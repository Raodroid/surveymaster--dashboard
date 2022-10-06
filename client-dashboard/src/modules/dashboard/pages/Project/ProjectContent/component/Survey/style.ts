import styled from 'styled-components';

export const SurveyWrapper = styled.div`
  height: 100%;
`;

export const TableWrapper = styled.div`
  padding: 20px 12px 16px;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .ant-pagination {
    margin-top: 10px;
    text-align: end;
  }

  .actions {
    gap: 4px;

    .three-dots,
    .ant-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      background: transparent;
      box-shadow: none;
      color: var(--ant-primary-color);
    }
  }

  a {
    color: var(--text-color);
  }

  .ant-table {
    width: 100%;
    a,
    .ant-table-cell div,
    span {
      font-size: 12px;
    }
  }
`;
