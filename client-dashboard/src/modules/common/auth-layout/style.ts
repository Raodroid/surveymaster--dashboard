import styled from 'styled-components/macro';
import { screenSize } from 'enums/screenSize';
import templateVariable from '../../../app/template-variables.module.scss';
import { NavBarWrapper } from '../../dashboard/components/Navbar/styles';

export const PublicNavbar = styled(NavBarWrapper)`
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
