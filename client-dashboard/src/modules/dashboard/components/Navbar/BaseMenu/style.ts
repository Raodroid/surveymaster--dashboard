import styled from 'styled-components/macro';
import { Menu } from 'antd';

export const BaseMenuWrapper = styled(Menu)`
  gap: 0.5rem;

  .ant-menu-title-content {
    font-size: 14px;
    font-weight: 600;
  }

  .ant-menu-item-selected.ant-menu-item-only-child {
    background: white;
  }

  .ant-menu-item {
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;

    &:hover:not(.ant-menu-item-selected) {
      background: #f3f3f3;
    }
  }
`;
