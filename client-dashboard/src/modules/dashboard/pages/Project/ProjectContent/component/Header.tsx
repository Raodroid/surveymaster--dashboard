import { ClockCircleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Chat, Clock, PenFilled } from 'icons';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import { Link } from 'react-router-dom';
import { HeaderStyled } from '../style';

function ProjectHeader(props: {
  routes?: any;
  search?: string;
  setSearch?: (text: string) => void;
  links?: string[] | any;
}) {
  const { routes, search, setSearch, links } = props;

  const base = [
    {
      name: 'Project',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
    },
  ];

  if (routes) base.push(...routes);

  return (
    <HeaderStyled className="flex-center-start">
      <StyledBreadcrumb routes={base} />

      {/* {setSearch && (
        <div>
          <Input value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )} */}

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
