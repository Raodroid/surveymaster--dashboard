import { Button, Divider, Form, Input, InputRef } from 'antd';
import { useParseQueryString } from 'hooks/useParseQueryString';
import { Chat, Clock, PenFilled } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import qs from 'qs';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IGetParams } from 'type';
import { HeaderStyled } from './styles';

import { IBreadcrumbItem, StyledBreadcrumb } from '@/modules/common';
import { ROUTE_PATH } from '@/enums';
import { ProjectFilter } from '../project-filter/ProjectFilter';

interface IProjectHeader {
  routes?: IBreadcrumbItem[];
  showSearch?: boolean;
  RightMenu?: ReactNode;
}
const ProjectHeader: FC<IProjectHeader> = props => {
  const { routes, showSearch, RightMenu } = props;
  const searchRef = useRef<InputRef>(null);
  const [searchInput, setSearchInput] = useState('');

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const qsParams = useParseQueryString<IGetParams>();

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

  const handleSubmitBtnClick = useCallback(() => {
    if (!searchRef.current?.input?.value && !qsParams.q) {
      searchRef.current?.focus();
      return;
    }
    handleSearch();
  }, [searchRef, handleSearch, qsParams]);

  return (
    <HeaderStyled className="flex-center-start">
      <StyledBreadcrumb routes={base} />

      {showSearch && (
        <>
          <Form className="flex search-form" onFinish={handleSearch}>
            <Input
              placeholder={'Search...'}
              ref={searchRef}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              allowClear
              aria-label={'search survey'}
            />
            <Button
              htmlType="submit"
              onClick={handleSubmitBtnClick}
              aria-label={'submit search survey button'}
            >
              <SearchIcon />
            </Button>
          </Form>

          <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />

          <ProjectFilter />
        </>
      )}
      {RightMenu}
    </HeaderStyled>
  );
};

export default ProjectHeader;
