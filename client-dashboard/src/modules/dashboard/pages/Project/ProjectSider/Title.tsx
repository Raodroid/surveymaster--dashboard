import { UnorderedListOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { TitleStyled } from './style';

interface TitleProps {
  title: string;
  routePath: string;
}

function Title(props: TitleProps) {
  const { title, routePath } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const active = useMemo(() => {
    return pathname && pathname.includes(routePath);
  }, [pathname, routePath]);

  const handleTitleClick = () => {
    if (pathname.includes(routePath)) {
      navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT);
    } else {
      navigate(routePath);
    }
  };

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
          <PlusIcon className="plus-icon" /> {t('common.addNewSurvey')}
        </Button>
        <Button
          className="flex-center"
          onClick={() => navigate(`${routePath}`)}
        >
          <UnorderedListOutlined /> {t('common.surveyList')}
        </Button>
      </div>
    </TitleStyled>
  );
}

export default memo(Title);
