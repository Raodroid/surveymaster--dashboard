import { IBreadcrumbItem } from 'modules/common/commonComponent/StyledBreadcrumb';
import React, { FC, useCallback, useMemo } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router';
import { ViewSurveyWrapper } from './styles';
import SurveyForm from '../SurveyForm/SurveyForm';
import { projectRoutePath, useGetProjectByIdQuery } from '../../../../util';
import ProjectHeader from '../../Header';
import { projectSurveyParams } from '../index';
import { useGetSurveyById } from '../../Survey/util';
import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { ISurveyVersion } from '../../../../../../../../type';
import { useCheckScopeEntityDefault } from '../../../../../../../common/hoc';
import { ROUTE_PATH, SCOPE_CONFIG } from '../../../../../../../../enums';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import {
  FileIconOutlined,
  PenFilled,
  TrashOutlined,
} from '../../../../../../../../icons';
import { ExportOutlined } from '@ant-design/icons';
import { MenuDropDownWrapper } from '../../../../../../../../customize-components/styles';

function ViewSurvey() {
  const params = useParams<projectSurveyParams>();

  const { project } = useGetProjectByIdQuery(params.projectId);
  const { currentSurveyVersion, surveyData } = useGetSurveyById(
    params.surveyId,
  );

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: currentSurveyVersion?.name || '...',
        href: projectRoutePath.DETAIL_SURVEY.ROOT,
      },
    ],
    [params?.projectId, project.name, currentSurveyVersion?.name],
  );

  const links: string[] = [
    generatePath(projectRoutePath.DETAIL_SURVEY.EDIT, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),

    generatePath(projectRoutePath.DETAIL_SURVEY.HISTORY, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),

    generatePath(projectRoutePath.DETAIL_SURVEY.REMARKS, {
      projectId: params.projectId,
      surveyId: params.surveyId,
    }),
  ];

  return (
    <>
      <ProjectHeader routes={routes} links={links} />

      <ViewSurveyWrapper>
        <div>
          {surveyData.versions?.map(ver => (
            <DropDownMenuButton surveyVersion={ver} />
          ))}
        </div>
        <SurveyForm />
      </ViewSurveyWrapper>
    </>
  );
}

export default ViewSurvey;

interface IDropDownMenuButton {
  surveyVersion: ISurveyVersion;
}

enum ACTION_ENUM {
  COMPLETE = 'COMPLETE',
  DUPLICATE = 'DUPLICATE',
  EXPORT = 'EXPORT',
  DELETE = 'DELETE',
}

const DropDownMenuButton: FC<IDropDownMenuButton> = props => {
  const { surveyVersion } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ surveyId?: string }>();

  const { canUpdate, canRead } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.SURVEYS,
  );

  const items = useMemo(() => {
    const baseMenu: ItemType[] = [];

    if (canUpdate) {
      baseMenu.push({
        icon: <PenFilled />,
        label: t('common.edit'),
        key: ACTION_ENUM.COMPLETE,
      });
      baseMenu.push({
        icon: <FileIconOutlined />,
        label: t('common.duplicateVersion'),
        key: ACTION_ENUM.DUPLICATE,
      });
    }
    if (canRead) {
      baseMenu.push({
        icon: <ExportOutlined />,
        label: t('common.export'),
        key: ACTION_ENUM.EXPORT,
      });
      baseMenu.push({
        icon: <TrashOutlined />,
        label: t('common.delete'),
        key: ACTION_ENUM.DELETE,
      });
    }
    return baseMenu;
  }, [canRead, canUpdate, t]);

  const handleSelect = useCallback(
    async (props: {
      record: ISurveyVersion;
      key: string;
      keyPath: string[];
      item: React.ReactInstance;
    }) => {
      const { key, record } = props;
      switch (key) {
        case ACTION_ENUM.DELETE:
        case ACTION_ENUM.EXPORT:
        case ACTION_ENUM.COMPLETE:
        case ACTION_ENUM.DUPLICATE:
      }
    },
    [],
  );

  const menu = (
    <MenuDropDownWrapper
      onClick={input => {
        handleSelect({ ...input, record: surveyVersion }).then();
      }}
      items={items}
    />
  );

  const changeViewVersion = useCallback(() => {
    navigate(
      generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT, {
        surveyId: params.surveyId,
      }) + `?version=${surveyVersion.displayId}`,
    );
  }, [navigate, params.surveyId, surveyVersion.displayId]);
  return (
    <Dropdown.Button
      overlay={menu}
      onClick={changeViewVersion}
      placement="bottomLeft"
      trigger={'click' as any}
    >
      {surveyVersion.displayId}
    </Dropdown.Button>
  );
};
