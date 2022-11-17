import { Button, Divider, Form, Input, InputRef } from 'antd';
import useParseQueryString from 'hooks/useParseQueryString';
import { Chat, Clock, PenFilled } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import StyledBreadcrumb, {
  IBreadcrumbItem,
} from 'modules/common/commonComponent/StyledBreadcrumb';
import qs from 'qs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IGetParams } from 'type';
import { projectRoutePath } from '../../../util';
import ProjectFilter from '../ProjectFilter';
import { HeaderStyled } from './styles';

function ProjectHeader(props: {
  routes?: IBreadcrumbItem[];
  links?: string[];
  search?: boolean;
}) {
  const { routes, links, search } = props;
  const searchRef = useRef<InputRef>(null);
  const [searchInput, setSearchInput] = useState('');

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const qsParams = useParseQueryString<IGetParams>();

  const base = [
    {
      name: 'Project',
      href: projectRoutePath.ROOT,
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

      {search && (
        <>
          <Form className="flex search-form" onFinish={handleSearch}>
            <Input
              placeholder={'Search...'}
              ref={searchRef}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              allowClear
            />
            <Button htmlType="submit" onClick={handleSubmitBtnClick}>
              <SearchIcon />
            </Button>
          </Form>

          <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />

          <ProjectFilter />
        </>
      )}

      {links && (
        <div className="wrapper flex-center">
          <Link to={links[0]}>
            <PenFilled />
          </Link>

          <Divider type="vertical" style={{ height: 8, width: 1 }} />

          <Link to={links[1]}>
            <Clock />
          </Link>

          <Divider type="vertical" style={{ height: 8, width: 1 }} />

          <Link to={links[2]}>
            <Chat />
          </Link>
        </div>
      )}
    </HeaderStyled>
  );
}

export default ProjectHeader;
