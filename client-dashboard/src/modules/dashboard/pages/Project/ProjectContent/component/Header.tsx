import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { ROUTE_PATH } from 'enums';
import StyledBreadcrumb from 'modules/common/commonComponent/StyledBreadcrumb';
import { HeaderStyled } from '../style';

function ProjectHeader(props: {
  routes?: any;
  // search?: string;
  // setSearch?: (text: string) => void;
}) {
  // const { routes, search, setSearch } = props;
  const { routes } = props;

  const base = [
    {
      name: 'Project',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
    },
  ];

  if (routes) base.push(...routes);

  return (
    <HeaderStyled className="flex-start">
      <StyledBreadcrumb routes={base} />

      {/* {setSearch && (
        <div>
          <Input value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )} */}
    </HeaderStyled>
  );
}

export default ProjectHeader;
