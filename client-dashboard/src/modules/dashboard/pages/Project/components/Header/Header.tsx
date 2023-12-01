import { Divider, Form, Input, InputRef } from 'antd';
import { useParseQueryString } from '@/hooks/useParseQueryString';
import { SearchIcon } from '@/icons/SearchIcon';
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
import { IGetParams } from '@/type';

import {
  IBreadcrumbItem,
  StyledBreadcrumb,
  useCheckScopeEntityDefault,
} from '@/modules/common';
import { EntityEnum, ROUTE_PATH } from '@/enums';
import AddSurveyButton from '../../../Survey/SurveyModal/AddSurveyButton';
import ViewProjectDetailButton from '../ProjectModal/ViewProjectDetailButton';
import EditProjectButton from '../ProjectModal/EditProjectButton';
import AddProjectButton from '../ProjectModal/AddProjectButton';
import { ProjectFilter } from '@pages/Project/components/project-filter/ProjectFilter';
import ViewSurveyButton from '@pages/Survey/SurveyModal/ViewSurveyButton';
import { SurveyVersionSelect, useGetSurveyById } from '@pages/Survey';
import { useParams } from 'react-router';
import { projectSurveyParams } from '@pages/Survey/DetailSurvey/DetailSurvey';

interface IProjectHeader {
  routes?: IBreadcrumbItem[];
  showSearch?: boolean;
  RightMenu?: ReactNode;
  showAddProjectBtn?: boolean;
  showEditProjectBtn?: boolean;
  showAddSurveyBtn?: boolean;
  showDetailProjectBtn?: boolean;
  showDetailSurveyBtn?: boolean;
  showSurveyVersions?: boolean;
}

const ProjectHeader: FC<IProjectHeader> = props => {
  const {
    routes,
    showSearch,
    RightMenu,
    showAddProjectBtn,
    showAddSurveyBtn,
    showEditProjectBtn,
    showDetailProjectBtn,
    showDetailSurveyBtn,
    showSurveyVersions,
  } = props;

  const { canUpdate, canCreate } = useCheckScopeEntityDefault(
    EntityEnum.PROJECT,
  );
  const { canCreate: canCreateSurvey } = useCheckScopeEntityDefault(
    EntityEnum.SURVEY,
  );

  const base = [
    {
      name: 'Project',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
    },
  ];

  if (routes) base.push(...routes);

  return (
    <>
      <div>
        <div className="flex items-center justify-center h-[76px] px-[30px]">
          <StyledBreadcrumb routes={base} />
          {showSurveyVersions && (
            <>
              <Divider type="vertical" className={'h-[8px]'} />
              <VersionSelect />
            </>
          )}
          <div className={'flex-1 flex items-center'}>
            {showAddProjectBtn && canCreate && (
              <>
                <Divider type="vertical" className={'h-[8px]'} />
                <AddProjectButton />
              </>
            )}
            {showAddSurveyBtn && canCreateSurvey && (
              <>
                <AddSurveyButton />
                <Divider type="vertical" className={'h-[8px]'} />
              </>
            )}
          </div>

          {showDetailSurveyBtn && (
            <>
              <ViewSurveyButton />
              <Divider type="vertical" className={'h-[8px]'} />
            </>
          )}
          {showDetailProjectBtn && (
            <>
              <ViewProjectDetailButton />
              <Divider type="vertical" className={'h-[8px]'} />
            </>
          )}
          {showEditProjectBtn && canUpdate && (
            <>
              <EditProjectButton />
              <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />
            </>
          )}

          {showSearch && (
            <>
              <SearchInput />

              <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />

              <ProjectFilter />
            </>
          )}

          {RightMenu && (
            <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />
          )}
          {RightMenu}
        </div>
      </div>
    </>
  );
};

export default ProjectHeader;

const VersionSelect = () => {
  const params = useParams<projectSurveyParams>();

  const { surveyData, currentSurveyVersion } = useGetSurveyById(
    params.surveyId,
  );

  return (
    <SurveyVersionSelect
      value={currentSurveyVersion?.displayId}
      versions={surveyData?.versions}
    />
  );
};

const SearchInput = () => {
  const searchRef = useRef<InputRef>(null);
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const qsParams = useParseQueryString<IGetParams>();

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

  useEffect(() => {
    if (qsParams.q) setSearchInput(qsParams.q);
  }, [qsParams]);

  return (
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
  );
};
