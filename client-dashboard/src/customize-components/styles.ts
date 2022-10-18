import styled from 'styled-components/macro';
import templateVariable from '../app/template-variables.module.scss';
import { Menu } from 'antd';

export const ThreeDotsDropdownWrapper = styled.div`
  display: flex;
  :hover {
    cursor: pointer;
  }
  .three-dots {
    display: flex;
    width: 40px;
    height: 40px;
    flex-flow: column;
    border-radius: 8px;
    color: ${templateVariable.text_primary_color};
    :hover {
      background: ${templateVariable.primary_color_outline};
      color: #232f3e;
      .dots-container {
        .dot {
          background: #232f3e;
        }
      }
    }
    .dots-container {
      display: flex;
      flex-flow: column;
      margin: auto;
      color: ${templateVariable.primary_color};
      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #25232c;
        &:nth-child(2) {
          margin: 2px 0;
        }
      }
    }
    &.ant-dropdown-open {
      color: ${templateVariable.primary_color};
    }
  }
`;

export const MenuDropDownWrapper = styled(Menu)`
  &.ant-dropdown-menu .ant-dropdown-menu-item {
    margin: 1rem 1.5rem;
  }
  svg {
    color: ${templateVariable.primary_color};
    margin-right: 1rem;
  }
  .ant-dropdown-menu-item-active {
    background: transparent;
    .ant-dropdown-menu-title-content {
      color: ${templateVariable.primary_color};
    }
  }
`;

interface IIcons {
  className?: string;
}
export const Icons = styled.div<IIcons>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: currentColor;
  background-color: ${p =>
    p.className === 'bg-blue-success' && templateVariable.success_color};
  background-color: ${p =>
    p.className === 'bg-orange-warning' && templateVariable.warning_color};
`;
