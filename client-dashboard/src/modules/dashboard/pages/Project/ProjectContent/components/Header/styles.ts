import styled from 'styled-components/macro';

export const HeaderStyled = styled.div`
  min-height: 76px;
  max-height: 76px;
  padding: 0 22px;
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
      font-size: 14px;
    }
    .ant-btn {
      background: transparent;
      padding: 0;
      width: 32px;
      height: 32px;
      box-shadow: none;
      z-index: 10;
    }
    .ant-input-affix-wrapper {
      border: none;
      box-shadow: none;
    }
    .ant-input-clear-icon {
      display: flex;
      align-items: center;
      justify-content: center;
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
