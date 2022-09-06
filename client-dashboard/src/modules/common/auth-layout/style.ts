import styled from 'styled-components';
import { screenSize } from 'enums/screenSize';
import {
  NavbarUserDashboard,
  NavbarMenuRight,
} from 'modules/dashboard/components/Navbar/styles';
import templateVariable from '../../../app/template-variables.module.scss';

export const ImageGradientStyled = styled.div`
  position: relative;
  width: 100%;
  min-height: 90vh;
  padding-bottom: 2.857rem;
  transition: all 0.3s ease-in;
  //background-image: url(/Photos/signatureBanner.webp);
  background-size: cover;
  background-position-y: 100%;
  @media screen and (max-width: 1440px) {
    min-height: 100vh;
  }
  @media screen and ${screenSize.medium} {
    background-image: none;
  }
`;

export const PublicNavbar = styled(NavbarUserDashboard)`
  background: transparent !important;
  /* background: white; */
  & > .logo {
    &:hover {
      cursor: pointer;
    }
    align-items: center;
    & > img {
      margin-right: 1.429rem;
    }
    & > .app-name {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 16px;
      color: ${templateVariable.text_primary_color};
    }
    height: 70px;
    display: inline-block;
    margin-top: -3px;
    > svg {
      height: 100%;
      width: 144px;
      path {
        fill: white;
      }
    }
  }

  @media screen and ${screenSize.medium} and (orientation: portrait),
    screen and ${screenSize.medium} and (orientation: landscape) {
    display: none;
  }
`;

export const PublicNavbarRight = styled(NavbarMenuRight)`
  max-width: 430px;
  margin-right: -20px;
  padding-left: 1rem !important;

  & > .ant-menu-item {
    &:after {
      content: '';
      position: absolute;
      width: calc(100% - 0.857rem);
      height: 2.857rem;
      left: 50%;
      top: 50%;
      border-radius: 6px;
      transform: translate(-50%, -50%);
      background: transparent;
      z-index: -1;
    }
    padding: 0 20px !important;
    &:hover {
      background: none !important;
      &:after {
        background: rgba(35, 37, 103, 0.04);
      }
    }
    &.user-dashboard-activate:hover {
      &:after {
        width: calc(100% - 3rem);
      }
    }
    &:hover > .menu-item-title {
      color: white;
    }
    &.menu-item-buy-kit {
      margin-right: 2.857rem;
      &:after {
        content: '';
        position: absolute;
        right: -2.857rem;
        top: 50%;
        transform: translateY(-50%);
        height: 12px;
        width: 2px;
        background: rgba(35, 37, 103, 0.2);
      }
    }
    &.menu-item-sign-up {
      padding-right: 0.5rem !important;
      margin-left: 0.5rem;
    }
    &.menu-item-sign-in {
      padding-left: 1rem !important;
      & > .menu-item-title:after {
        content: '\u002F';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 5px;
        color: ${templateVariable.text_primary_color};
      }
    }

    .menu-item-title {
      color: #fff;
    }
  }
  .ant-btn span {
    font-size: 14px;
  }
`;
