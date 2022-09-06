import styled from 'styled-components';
import { Menu, Layout } from 'antd';
import templateVariable from '../../../../app/template-variables.module.scss';

const { Header } = Layout;
const screenMobileNavbar = `(max-width: 1024px)`;

export const NavbarMenuRight = styled(Menu)`
  background: transparent !important;
  max-width: 480px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-btn {
    margin-right: 1rem;
  }
  & > .ant-menu-item {
    color: ${templateVariable.text_primary_color};
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      width: calc(100% - 2.857rem);
      height: 2.857rem;
      left: 50%;
      top: 50%;
      border-radius: 6px;
      transform: translate(-50%, -50%);
      background: transparent;
      z-index: -1;
    }
    &:not(:first-child) {
      padding: 0 0 0 2.857rem;
    }
    &:hover {
      background: none !important;
      color: ${templateVariable.text_primary_color};
      &:after {
        //background: rgba(35, 37, 103, 0.04);
      }
    }
    & > span.menu-item-title,
    .ant-menu-dropdown-item > span.menu-item-title {
      font-weight: 600;
      font-size: 1.143rem !important;
    }
    & > img.avatar-user-dashboard {
      width: 41px;
      height: 41px;
      object-fit: cover;
      border-radius: 50%;
      margin-left: auto;
      padding: 4px;
      transition: 0.5s;
      border: 1px solid transparent;
    }

    .ant-menu-dropdown-item {
      .dropdown-icon {
        margin-left: 1rem;
        color: ${templateVariable.primary_color};

        & > svg {
          width: 12px;
          height: 15px;
          transform: rotate(-90deg);
          transition: transform 0.5s;
        }
      }
    }
    .ant-dropdown-open {
      .dropdown-icon {
        & > svg {
          transform: rotate(90deg);
        }
      }
    }

    &.ant-menu-item-selected {
      background: none !important;
      color: ${templateVariable.primary_color};
      & > .dropdown-icon {
        & > svg {
          transform: rotate(-270deg);
          -webkit-transform: rotate(-270deg);
          -ms-transform: rotate(-270deg);
          & > g > g > g > path {
            fill: ${templateVariable.primary_color};
          }
        }
      }
      & > img.avatar-user-dashboard {
        border: 1px solid #292929;
      }
    }
    &.profile-item {
      padding-right: 2.857rem;
    }
    &.user-info-item {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 2px;
        height: 0.857rem;
        background: rgba(35, 37, 103, 0.2);
      }
      &:hover > .avatar-user-dashboard {
        border: 1px solid ${templateVariable.border_color} !important;
      }
      &:focus > .avatar-user-dashboard,
      &:active > .avatar-user-dashboard {
        border: 1px solid #292929;
      }
    }
  }
  .info-contact-btn {
    border: none;
    background-color: transparent;

    &:hover {
      background-color: rgba(35, 37, 103, 0.08);
    }
  }
`;

export const NavbarUserDashboard = styled(Header)`
  background: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  z-index: 10;
  height: 70px;
  & > .logo {
    padding-right: 1rem;
    > a {
      height: 70px;
      display: inline-block;
      margin-top: -6px;
      > svg {
        height: 100%;
        width: 135px;
      }
    }
    img {
      width: 32px;
      height: 32px;
      object-fit: cover;
    }
  }

  @media screen and ${screenMobileNavbar} and (orientation: portrait),
    screen and ${screenMobileNavbar} and (orientation: landscape) {
    &.navbar-user-dashboard {
      display: none;
    }
  }
`;
