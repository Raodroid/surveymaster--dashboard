import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';

export const ProjectContentWrapper = styled(BaseSectionWrapper)`
  flex: 1;
  padding: 0;
  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

export const HeaderStyled = styled.div`
  min-height: 76px;
  padding: 0 32px;
  border-bottom: 1px solid #f3eef3;
  .breadcrumb {
    border-top: none;
    span,
    a {
      font-size: 16px;
    }
  }
  .breadcrumb-item span {
    color: var(--text-color);
  }
  .search-form {
    flex: 1;
    margin-left: 20px;
    .ant-input {
      border: none;
      box-shadow: none;
      font-size: 14px;
    }
    .ant-btn {
      background: transparent;
      padding: 0;
      width: 32px;
      height: 32px;
      box-shadow: none;
    }
  }
  svg {
    color: var(--ant-primary-color);
  }
  .wrapper {
    margin-left: auto;
    gap: 24px;
    .ant-divider {
      background: #d3d3e1;
      margin: 2px 0 0;
    }
    a {
      display: flex;
      align-items: center;
    }
  }
`;

export const ProjectHomeWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const ProjectTableWrapper = styled.div`
  flex: 1;
  padding: 20px 12px;
  .ant-table-cell {
    height: 48px;
    padding: 0 10px;
    &:last-child {
      text-align: center;
    }
  }
  .ant-table {
    .ant-table-cell {
      a,
      span,
      div {
        font-size: 12px;
        color: var(--text-color);
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
