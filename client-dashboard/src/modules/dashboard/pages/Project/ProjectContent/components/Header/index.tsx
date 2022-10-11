import { Button, Divider, Form, Input, InputRef } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Chat, Clock, PenFilled } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProjectFilter from './ProjectFilter';
import { HeaderStyled } from './styles';

function ProjectHeader(props: {
  routes?: any;
  search?: string;
  debounce?: string;
  setSearch?: (text: string) => void;
  setFilter?: (text: string) => void;
  links?: string[] | any;
  setParams?: (payload: any) => void;
}) {
  const { routes, search, debounce, setSearch, setFilter, links, setParams } =
    props;
  const searchRef = useRef<InputRef>(null);

  const base = [
    {
      name: 'Project',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
    },
  ];

  if (routes) base.push(...routes);

  useEffect(() => {
    if (!debounce && setFilter) {
      setFilter('');
    }
  }, [debounce, setFilter]);

  const handleSubmitBtnClick = () => {
    if (search && setFilter && search.trim()) {
      setFilter(search);
    } else {
      searchRef.current?.focus();
    }
  };

  return (
    <HeaderStyled className="flex-center-start">
      <StyledBreadcrumb routes={base} />

      {setSearch && setFilter && (
        <>
          <Form
            className="flex search-form"
            onFinish={() => search && setFilter(search)}
          >
            <Input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button htmlType="submit" onClick={handleSubmitBtnClick}>
              <SearchIcon />
            </Button>
          </Form>

          <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />

          <ProjectFilter setParams={setParams} />
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
