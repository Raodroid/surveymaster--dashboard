import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TitleStyled } from './style';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { MenuIcon, PlusIcon } from 'icons';
import HamburgerAnimation from 'icons/HamburgerAnimation';
import { ListIcon } from 'icons/ListIcon';

interface TitleProps {
  title: string;
  routePath: Record<string, string>;
}

function Title(props: TitleProps) {
  const { title, routePath } = props;
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const { pathname } = useLocation();

  const handleTitleClick = () => {
    if (!active) {
      setActive(true);
      navigate(routePath.HOME);
    } else {
      setActive(false);
      navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.HOME);
    }
  };

  useEffect(() => {
    if (!pathname.includes(routePath.HOME)) setActive(false);
  }, [pathname, routePath]);

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
          onClick={() => navigate(routePath.ADD_NEW_SURVEY)}
        >
          <PlusIcon className="plus-icon" /> Add New Survey
        </Button>
        <Button
          className="flex-center"
          onClick={() => navigate(routePath.SURVEY_LIST)}
        >
          <ListIcon /> Survey List
        </Button>
      </div>
    </TitleStyled>
  );
}

export default Title;
