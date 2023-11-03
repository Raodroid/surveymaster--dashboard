import styled from 'styled-components/macro';
import { Menu, Card } from 'antd';
import { screenSize } from 'enums';
import templateVariable from 'app/template-variables.module.scss';

export const ProfilesMenuWrapper = styled.div`
  margin-bottom: 1.5rem;
  .ant-card-body {
    display: flex;
    align-items: center;
    button {
      background: #fa668a;
    }
  }
  @media only screen and ${screenSize.medium} {
    margin-bottom: 1rem;
    .ant-card {
      border-radius: 0;
      border-right: 0;
      border-left: 0;
    }
  }
`;

export const ProfileCard = styled(Card)`
  padding: 12px 40px;
  @media only screen and ${screenSize.medium} {
    padding: 0;
  }
`;

export const MenuWrapper = styled(Menu)`
  width: 100%;
  border: none;
  &.ant-menu-horizontal {
    line-height: 10px;
  }
  & > li.ant-menu-item {
    padding: 12px 16px !important;
    display: inline;
    margin: 0 !important;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 0 !important;
    &:not(:last-child) {
      margin-right: 8px !important;
    }
    color: ${templateVariable.text_primary_color};
    border-radius: 6px;
    &:hover,
    &:focus,
    &:active {
      color: #fff !important;
      background: ${templateVariable.secondary_color_hover};
    }
    &.ant-menu-item-selected {
      background: ${templateVariable.secondary_color};
      color: #fff;
      border-bottom: 0 !important;
    }
    &:after {
      border-bottom: none;
    }
  }
`;

export const MobileMenuWrapper = styled(Menu)`
  background: #fbf8f5;
  .ant-menu-submenu-title {
    margin: 0.5rem 0;
    background: transparent;
    .sub-menu-title {
      span {
        font-size: 14px;
        &:nth-child(1) {
          color: ${templateVariable.text_primary_color};
          font-weight: bold;
        }
        &:nth-child(2) {
          color: ${templateVariable.primary_color};
        }
      }
    }
  }
  .ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
    color: ${templateVariable.text_primary_color};
  }
  .ant-menu-sub.ant-menu-inline {
    height: 100vh;
    background: transparent;
    border-top: 1px solid ${templateVariable.border_color};
  }
  .ant-menu-sub.ant-menu-inline > .ant-menu-item {
    border-bottom: 1px solid ${templateVariable.border_color};
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background: transparent;
    span {
      color: ${templateVariable.primary_color};
    }
  }
  .ant-menu-item::after {
    border: 0;
  }
`;
