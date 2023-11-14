import { Button, Divider, Form, Input, InputRef } from 'antd';
import { useParseQueryString } from 'hooks/useParseQueryString';
import { PenFilled, PlusIcon } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import qs from 'qs';
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IGetParams } from 'type';

import { IBreadcrumbItem, StyledBreadcrumb } from '@/modules/common';
import { ROUTE_PATH } from '@/enums';
import { ProjectFilter } from '../project-filter/ProjectFilter';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import { projectSurveyParams } from '@pages/Survey/DetailSurvey/DetailSurvey';
import AddSurveyButton from './AddSurveyButton';

interface IProjectHeader {
  routes?: IBreadcrumbItem[];
  showSearch?: boolean;
  RightMenu?: ReactNode;
  showAddProjectBtn?: boolean;
  showEditProjectBtn?: boolean;
  showAddSurveyBtn?: boolean;
}
const ProjectHeader: FC<IProjectHeader> = props => {
  const {
    routes,
    showSearch,
    RightMenu,
    showAddProjectBtn,
    showAddSurveyBtn,
    showEditProjectBtn,
  } = props;

  const { t } = useTranslation();
  const searchRef = useRef<InputRef>(null);
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const qsParams = useParseQueryString<IGetParams>();

  const params = useParams<projectSurveyParams>();

  const base = [
    {
      name: 'Project',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
    },
  ];

  if (routes) base.push(...routes);

  useEffect(() => {
    if (qsParams.q) setSearchInput(qsParams.q);
  }, [qsParams]);

  const handleSearch = useCallback(() => {
    navigate(
      pathname +
        '?' +
        qs.stringify({
          ...qsParams,
          q: searchRef.current?.input?.value,
          page: 1,
        }),
      { replace: true },
    );
  }, [navigate, pathname, qsParams]);

  return (
    <>
      <div>
        <div className="flex items-center justify-center h-[76px] px-[30px]">
          <StyledBreadcrumb routes={base} />
          <div className={'flex-1 flex items-center'}>
            {showAddProjectBtn && (
              <Button
                type={'text'}
                icon={<PlusIcon />}
                size={'large'}
                onClick={() => {
                  navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.ADD);
                }}
              >
                {t('common.addNewProject')}
              </Button>
            )}
            {showAddSurveyBtn && <AddSurveyButton />}
          </div>
          {showEditProjectBtn && (
            <Button
              type={'text'}
              icon={<PenFilled />}
              size={'large'}
              onClick={() =>
                navigate(
                  generatePath(
                    ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.EDIT,
                    {
                      projectId: params?.projectId,
                    },
                  ),
                )
              }
            >
              {t('common.editProject')}
            </Button>
          )}
          <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />

          {showSearch && (
            <>
              <Form className="flex w-[200px]" onFinish={handleSearch}>
                <Input
                  placeholder={'Search...'}
                  ref={searchRef}
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  allowClear
                  aria-label={'search survey'}
                  prefix={<SearchIcon />}
                  size={'large'}
                />
              </Form>

              <Divider
                type="vertical"
                style={{ margin: '0 16px', height: 8 }}
              />

              <ProjectFilter />
            </>
          )}
          {RightMenu}
        </div>
      </div>
    </>
  );
};

export default ProjectHeader;
