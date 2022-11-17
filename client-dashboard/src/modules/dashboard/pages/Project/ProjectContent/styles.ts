import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import { screenSize } from '../../../../../enums';

export const ProjectContentWrapper = styled(BaseSectionWrapper)`
  width: 100%;
  overflow: hidden;
  flex: 1;
  padding: 0;
  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }

  @media only screen and ${screenSize.large} {
    overflow: unset;
  }
`;

export const ProjectHomeWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const ProjectTableWrapper = styled.div<{ centerLastChild: boolean }>`
  .ant-table-thead .ant-table-cell:nth-last-child(2) {
    text-align: ${props => (props.centerLastChild ? 'center' : '')};
  }

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

  .ant-table {
    .ant-table-cell {
      padding: 6px 10px;
      a,
      span,
      div {
        font-size: 12px;
        color: var(--text-color);
      }
      .dots-container {
        color: var(--ant-primary-color);
      }
    }
    table {
      border-spacing: 0;
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
    cursor: pointer;
    height: 48px;
  }
`;
