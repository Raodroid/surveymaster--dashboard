import { Button } from 'antd';
import styled from 'styled-components';

export const HeaderStyled = styled.div`
  min-height: 76px;
  max-height: 76px;
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

export const ProjectFilterWrapper = styled.div``;

export const ProjectFilterBtn = styled(Button)`
  padding: 2px;
  padding-left: 12px;
  gap: 4px;
  border-radius: 4px;

  > svg {
    color: white;
  }

  .counter {
    margin-left: 8px;
    width: 44px;
    height: 28px;
    border-radius: 2px;
    background: white;
    color: var(--text-color);
    gap: 4px;

    svg {
      width: 9px;
    }
  }
`;

export const ProjectFilterOverlayWrapper = styled.div`
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 24px;

  .header {
    font-weight: bold;
    font-size: 16px;
  }

  .left {
    gap: 6px;

    .counter {
      width: 32px;
      height: 24px;
      border-radius: 4px;
      background: rgb(238, 238, 243);

      font-weight: 600;
      font-size: 12px;
    }
  }

  .right {
    .ant-btn {
      padding: 0;
      width: 24px;
      height: 24px;
      background: transparent;
    }
  }

  .filters {
    gap: 20px;
    .ant-form-item-control-input ~ div {
      display: none !important;
    }

    .ant-form-item {
      margin: 0;
    }
  }

  .dates {
    gap: 12px;
    padding-left: 22px;

    .ant-picker:not(.ant-picker-disabled) {
      .ant-picker-suffix {
        color: var(--ant-primary-color);

        svg {
          width: 12px;
        }
      }
    }
  }

  .ant-checkbox-wrapper {
    span {
      font-weight: 600;
    }
  }

  .ant-btn {
    border-radius: 2px;
  }
`;
