import styled from 'styled-components/macro';

export const ProjectTableWrapper = styled.div<{ centerLastChild: boolean }>`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 12px 5px 0 12px;
  .ProjectTableWrapper {
    &__body {
      padding: 1.5rem;
      height: 100%;
      overflow: hidden;
    }
  }

  .ant-table-header {
    overflow: unset !important;
  }
  .ant-table-thead {
    height: 48px;
  }
  .ant-table-body {
    padding-right: 4px;
    .ant-table-tbody {
      border-spacing: 0;
    }
  }
  .actions {
    gap: 4px;
    .ant-btn,
    .three-dots {
      width: 32px;
      height: 32px;
      padding: 0;
    }
    .ant-btn-default {
      background: transparent;
      border-radius: 8px;
      box-shadow: none;
      &:hover {
        background: var(--ant-primary-color-deprecated-l-35);
      }
    }
  }
  .ant-pagination {
    margin-top: 10px;
    text-align: end;
  }
  .ant-table-row {
    height: 48px;
  }
`;
