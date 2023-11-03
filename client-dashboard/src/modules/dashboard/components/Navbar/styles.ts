import styled from 'styled-components/macro';
import { Layout } from 'antd';

const { Header } = Layout;
const screenMobileNavbar = `(max-width: 1024px)`;

export const NavBarWrapper = styled(Header)`
  background: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  z-index: 10;
  height: 70px;

  .main-menu-root {
    flex: 1;
  }
  .right-menu-root {
    min-width: 200px;
    display: flex;
    justify-content: flex-end;
  }

  @media screen and ${screenMobileNavbar} and (orientation: portrait),
    screen and ${screenMobileNavbar} and (orientation: landscape) {
    &.navbar-user-dashboard {
      display: none;
    }
  }
`;
