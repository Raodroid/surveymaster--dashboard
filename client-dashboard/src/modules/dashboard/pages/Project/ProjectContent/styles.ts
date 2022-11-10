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
  overflow: scroll;
  .ProjectTableWrapper {
    &__body {
      padding: 1.5rem;
      height: 100%;
      overflow: scroll;
    }
  }

  .ant-table-cell {
    height: 48px;
    padding: 0 10px;
  }

  .ant-table {
    .ant-table-cell {
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
  }
`;
