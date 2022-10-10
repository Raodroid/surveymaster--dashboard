import { UnorderedListOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ROUTE_PATH } from 'enums';
import { PlusIcon } from 'icons';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router';
import { TitleStyled } from './style';

interface TitleProps {
  title: string;
  routePath: string;
  id?: string;
}

function Title(props: TitleProps) {
  const { title, routePath: route_path, id: userId } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const params = useParams();
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;

  const active = useMemo(() => {
    return params && params.id && params.id === userId;
  }, [userId, params]);

  const handleTitleClick = () => {
    if (userId === params.id) {
      navigate(routePath.ROOT);
    } else {
      navigate(route_path);
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
            navigate(`${pathname}/add-survey${search}`);
          }}
        >
          <PlusIcon className="plus-icon" /> {t('common.addNewSurvey')}
        </Button>
        <Button className="flex-center" onClick={() => navigate(route_path)}>
          <UnorderedListOutlined /> {t('common.surveyList')}
        </Button>
      </div>
    </TitleStyled>
  );
}

export default memo(Title);
