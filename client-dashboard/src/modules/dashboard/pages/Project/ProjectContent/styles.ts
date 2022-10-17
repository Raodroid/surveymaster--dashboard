import { Menu } from 'antd';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';

export const ProjectContentWrapper = styled(BaseSectionWrapper)`
  width: 100%;
  overflow: hidden;
  flex: 1;
  padding: 0;
  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

export const ProjectHomeWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const ProjectTableWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  .ant-table-cell {
    height: 48px;
    padding: 0 10px;
  }

  .ant-table {
    padding: 20px 12px 0;
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

export const StyledProjectMenu = styled(Menu)`
  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;

    svg {
      color: var(--ant-primary-color);
      width: 14px;
      height: 14px;
    }
  }
`;
