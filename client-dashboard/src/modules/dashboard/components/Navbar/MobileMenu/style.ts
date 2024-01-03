import styled from 'styled-components/macro';
import templateVariable from '../../../../../app/template-variables.module.scss';

interface IMobileMenuWrapper {
  isOpen?: boolean;
}
export const MobileMenuWrapper = styled.div<IMobileMenuWrapper>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: ${p => (p.isOpen ? 'white' : templateVariable.app_bg_color)};
  transition: background 0.2s ease-in;

  .mobile-nav {
    &__header {
      padding-left: 1rem;
      display: flex;
      align-items: center;
      height: 70px;
    }
    &__content {
      height: 0;
      width: 100vw;
      opacity: 0;
      padding: 0 1rem;
      margin-left: 3.5rem;
      overflow: hidden;
      transition: height 0.2s ease-in, opacity 0.3s ease-in;
      &.open {
        height: calc(100vh - 70px);
        opacity: 1;
      }
    }
  }
  .hamburger-menu {
    margin-top: 8px;
  }
`;
