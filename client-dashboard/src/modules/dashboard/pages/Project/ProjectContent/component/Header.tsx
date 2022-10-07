import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Chat, Clock, PenFilled } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import { Link } from 'react-router-dom';
import { HeaderStyled } from '../style';
import { useEffect } from 'react';
import { CustomSpinSuspense } from 'modules/common/styles';

function ProjectHeader(props: {
  routes?: any;
  search?: string;
  debounce?: string;
  setSearch?: (text: string) => void;
  setFilter?: (text: string) => void;
  links?: string[] | any;
}) {
  const { routes, search, debounce, setSearch, setFilter, links } = props;

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

  return (
    <HeaderStyled className="flex-center-start">
      <StyledBreadcrumb routes={base} />

      {setSearch && setFilter && (
        <Form
          className="flex search-form"
          onFinish={() => {
            search && setFilter(search);
            console.log(search);
          }}
        >
          <Input value={search} onChange={e => setSearch(e.target.value)} />
          <Button htmlType="submit">
            <SearchIcon />
          </Button>
        </Form>
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
