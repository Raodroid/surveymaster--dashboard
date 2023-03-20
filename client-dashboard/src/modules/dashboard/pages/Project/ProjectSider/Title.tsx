import { Button } from 'antd';
import { ExternalIcon, InternalIcon, ListIcon, PlusIcon } from 'icons';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router';
import { projectRoutePath } from '../util';
import { TitleStyled } from './style';
import { IProject, ProjectTypes } from '../../../../../type';
import { useCheckScopeEntityDefault } from '../../../../common/hoc';
import { SCOPE_CONFIG } from '../../../../../enums';

interface TitleProps {
  title: string;
  routePath: string;
  id?: string;
  project: IProject;
}

function Title(props: TitleProps) {
  const { title, routePath: route_path, id: userId, project } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string }>();

  const { canCreate, canRead } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTIONS,
  );

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
        aria-label={'toggle project detail'}
      >
        <div>
          {project.type === ProjectTypes.INTERNAL ? (
            <InternalIcon />
          ) : (
            <ExternalIcon />
          )}
        </div>
        {title}
      </Button>
      <div className={`wrapper flex ${!isActive ? 'hide' : ''}`}>
        {canCreate && (
          <Button
            className="flex-center primary"
            type="primary"
            aria-label={'create new survey'}
            onClick={() => {
              navigate(
                generatePath(projectRoutePath.ADD_NEW_SURVEY, {
                  projectId: params.projectId,
                }),
              );
            }}
          >
            <PlusIcon className="plus-icon" />{' '}
            {project.type === ProjectTypes.INTERNAL
              ? t('common.addNewInternalSurvey')
              : t('common.addNewExternalSurvey')}
          </Button>
        )}
        {canRead && (
          <Button
            className="flex-center"
            onClick={() => navigate(route_path)}
            aria-label={'view survey list'}
          >
            <ListIcon /> {t('common.surveyList')}
          </Button>
        )}
      </div>
    </TitleStyled>
  );
}

export default memo(Title);
