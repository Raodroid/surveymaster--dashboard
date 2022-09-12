import { Button, Divider, Input, InputRef, Menu, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { CloseIcon } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { initImage } from '../form/UserForm';
import { TeamContentStyled } from '../styles';
import InviteMemberModal from './modals/InviteMemberModal';

interface DataType {
  key: React.Key;
  avatar?: string;
  name: string;
  email: string;
  authentication: string;
  threeDots: any;
}

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.antgroup.com"
          >
            1st menu item
          </a>
        ),
      },
      {
        key: '2',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.aliyun.com"
          >
            2nd menu item
          </a>
        ),
      },
      {
        key: '3',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            3rd menu item
          </a>
        ),
      },
    ]}
  />
);

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'avatar',
    render: (src: string) => (
      <img src={src} style={{ width: 40, height: 40, borderRadius: 12 }}></img>
    ),
    className: 'avatar-cell',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },

  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Authentication',
    dataIndex: 'authentication',
  },
  {
    title: '',
    dataIndex: 'threeDots',
    render: (menu: any) => (
      <ThreeDotsDropdown overlay={menu} trigger={['click']} />
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    avatar: initImage,
    name: 'John Brown',
    email: '@gmail.com',
    authentication: 'New York No. 1 Lake Park',
    threeDots: menu,
  },
  {
    key: '2',
    avatar: initImage,
    name: 'Jim Green',
    email: '@gmail.com',
    authentication: 'London No. 1 Lake Park',
    threeDots: menu,
  },
  {
    key: '3',
    avatar: initImage,
    name: 'Joe Black',
    email: '@gmail.com',
    authentication: 'Sidney No. 1 Lake Park',
    threeDots: menu,
  },
  {
    key: '4',
    avatar: initImage,
    name: 'Disabled User',
    email: '@gmail.com',
    authentication: 'Sidney No. 1 Lake Park',
    threeDots: menu,
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
};

function TeamContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const searchRef = useRef<InputRef>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <TeamContentStyled className="flex">
      <div className="part padding-24 name title">AMiLi</div>

      <div className="part" style={{ flex: 1 }}>
        <div className="search padding-24 flex-center">
          <Button
            className="search-btn"
            onClick={() => {
              if (search.trim()) {
                //filter
              } else {
                searchRef.current?.focus();
              }
            }}
          >
            <SearchIcon />
          </Button>
          <Input
            value={search}
            ref={searchRef}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Team Member..."
          />
          <Button type="primary" onClick={() => setShowInviteModal(true)}>
            Invite Member
          </Button>
        </div>

        <Divider />

        <div className="table">
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>

      <InviteMemberModal
        showModal={showInviteModal}
        setShowModal={setShowInviteModal}
      />
    </TeamContentStyled>
  );
}

export default TeamContent;
