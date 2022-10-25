import React, { useCallback } from 'react';
import { MobileMenuWrapper } from './style';
import { useToggle } from '../../../../../utils';
import HamburgerAnimation from '../../../../../icons/HamburgerAnimation';
import { LogoIcon } from '../../../../../icons';
import MenuList from './MenuList';

const MobileMenu = () => {
  const [openMobileMenu, toggleOpenMobileMenu] = useToggle();

  const handleOpenMobileMenu = useCallback(() => {
    toggleOpenMobileMenu();
  }, [toggleOpenMobileMenu]);

  return (
    <MobileMenuWrapper className="mobile-nav" isOpen={openMobileMenu}>
      <div className={'mobile-nav__header'}>
        <HamburgerAnimation
          onClick={handleOpenMobileMenu}
          open={openMobileMenu}
          className={'hamburger-menu'}
        />
        <LogoIcon className={'app_logo'} />
      </div>
      <div className={`mobile-nav__content ${openMobileMenu ? 'open' : ''}`}>
        {/*<MenuList mode={'vertical'} onClickMenuItem={handleOpenMobileMenu} />*/}
        <MenuList onChangeMenu={handleOpenMobileMenu} />
      </div>
    </MobileMenuWrapper>
  );
};

export default MobileMenu;
