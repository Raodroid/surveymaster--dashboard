import { UnorderedListOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PlusIcon } from 'icons';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router';
import { projectRoutePath } from '../util';
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
  const params = useParams();

  const isActive = useMemo(() => {
    return params?.projectId === userId;
  }, [userId, params]);

  const handleTitleClick = () => {
    if (userId === params?.projectId) {
      navigate(projectRoutePath.ROOT);
    } else {
      navigate(route_path);
    }
  };

  return (
    <TitleStyled>
      <Button
        className={`${isActive && 'active'} title-btn flex`}
        onClick={handleTitleClick}
      >
        {title}
      </Button>
      <div className={`wrapper flex ${!isActive ? 'hide' : ''}`}>
        <Button
          className="flex-center primary"
          type="primary"
          onClick={() => {
            navigate(
              generatePath(projectRoutePath.ADD_NEW_SURVEY, {
                projectId: params.projectId,
              }),
            );
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
