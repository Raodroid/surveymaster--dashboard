import { Button, Divider, Form, Input, InputRef } from 'antd';
import useParseQueryString from 'hooks/useParseQueryString';
import { Chat, Clock, PenFilled } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import StyledBreadcrumb, {
  IBreadcrumbItem,
} from 'modules/common/commonComponent/StyledBreadcrumb';
import { useCallback, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IGetParams } from 'type';
import { useDebounce } from 'utils';
import { projectRoutePath } from '../../../util';
import ProjectFilter from './ProjectFilter';
import { HeaderStyled } from './styles';
import { useEffect } from 'react';
import qs from 'qs';

function ProjectHeader(props: {
  routes?: IBreadcrumbItem[];
  links?: string[];
  search?: boolean;
}) {
  const { routes, links, search } = props;
  const searchRef = useRef<InputRef>(null);

  const [inputSearch, setInputSearch] = useState<string>('');
  const debounce = useDebounce(inputSearch);

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

  const handleSearch = useCallback(() => {
    navigate(pathname + '?' + qs.stringify({ ...qsParams, q: inputSearch }));
  }, [navigate, pathname, qsParams, inputSearch]);

  const handleSubmitBtnClick = useCallback(() => {
    if (inputSearch.trim()) {
      handleSearch();
    } else {
      searchRef.current?.focus();
    }
  }, [inputSearch, searchRef, handleSearch]);

  return (
    <HeaderStyled className="flex-center-start">
      <StyledBreadcrumb routes={base} />

      {search && (
        <>
          <Form className="flex search-form" onFinish={handleSearch}>
            <Input
              placeholder={'Search...'}
              ref={searchRef}
              value={inputSearch}
              allowClear
              onChange={e => {
                setInputSearch(e.target.value);
              }}
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
