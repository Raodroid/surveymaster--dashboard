import styled from 'styled-components';

export const ActionWrapper = styled.div`
  width: 100%;
  gap: 4px;
  overflow: hidden;

  .header-wrapper {
    gap: 4px;
  }

  .date {
    font-size: 12px;
    font-weight: 500;
  }

  .auth {
    font-size: 12px;
    color: var(--text-color);
    opacity: 0.4;
    display: flex;
    align-items: flex-end;
  }

  .action {
    font-size: 12px;
    font-weight: 600;
  }

  .today {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

export const CalendarListWrapper = styled.div`
  flex: 1;
  max-height: 100%;
  overflow: hidden;

  .ant-spin-nested-loading,
  .ant-spin-container {
    display: flex;
    flex-direction: column;
  }

  .list-divider {
    margin: 8px 0;
    height: 1px;
  }

  .list {
    flex: 1;
    overflow: hidden;

    & > div {
      height: 100%;
    }

    .simplebar-content {
      min-height: 100%;
      height: max-content;
      display: flex;
      flex-direction: column;
      gap: 20px;

      &:before,
      &:after {
        display: none;
      }
    }
  }

  .ant-empty {
    margin: auto;
  }
`;
