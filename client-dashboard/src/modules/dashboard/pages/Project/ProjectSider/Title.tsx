import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router';
import { TitleStyled } from './style';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { MenuIcon, PlusIcon } from 'icons';
import HamburgerAnimation from 'icons/HamburgerAnimation';
import { ListIcon } from 'icons/ListIcon';

interface TitleProps {
  title: string;
  routePath: string;
}

function Title(props: TitleProps) {
  const { title, routePath } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [active, setActive] = useState(
    pathname && pathname.includes(routePath),
  );

  const handleTitleClick = () => {
    if (pathname.includes(routePath)) {
      setActive(false);
      navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.HOME);
    } else {
      setActive(true);
      navigate(routePath);
    }
  };

  useEffect(() => {
    if (pathname && !pathname.includes(routePath)) setActive(false);
  }, [pathname, routePath, setActive]);

  return (
    <TitleStyled>
      <Button
        className={`${active && 'active'} title-btn flex`}
        onClick={handleTitleClick}
      >
        {title}
      </Button>
      <div className={`wrapper flex ${!active ? 'hide' : ''}`}>
        <Button
          className="flex-center primary"
          type="primary"
          onClick={() => {
            navigate(`${routePath}/add-survey`);
          }}
        >
          <PlusIcon className="plus-icon" /> Add New Survey
        </Button>
        <Button
          className="flex-center"
          onClick={() => navigate(`${routePath}`)}
        >
          <ListIcon /> Survey List
        </Button>
      </div>
    </TitleStyled>
  );
}

export default memo(Title);
