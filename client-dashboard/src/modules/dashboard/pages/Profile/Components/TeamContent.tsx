import { Button, Divider, Image, Input, InputRef, Menu, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { SearchIcon } from 'icons/SearchIcon';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import APIService from 'services/bioandme-service/base.service';
import { initImage } from '../form/UserForm';
import { TeamContentStyled } from '../styles';
import InviteMemberModal from './modals/InviteMemberModal';
import ResetUserPassword from './modals/ResetUserPassword';

interface DataType {
  key: React.Key;
  avatar?: string;
  name: string;
  email: string;
  authentication: string;
}

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
  const [search, setSearch] = useState('');
  const searchRef = useRef<InputRef>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditPreferencesModal, setShowEditPreferencesModal] =
    useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [userId, setUserId] = useState('');

  const handleEditPreferences = (id: string) => {
    setUserId(id);
    setShowEditPreferencesModal(true);
  };

  const handleResetPassword = (id: string) => {
    setUserId(id);
    setShowResetPasswordModal(true);
  };

  const baseParams = useMemo(
    () => ({
      page: 1,
      take: 10,
      roles: [1, 2, 3, 4, 7, 10],
    }),
    [],
  );

  function getStaffs(params: any): Promise<any> {
    return APIService.get(`/users`, { params });
  }

  const { data: dataStaff, isLoading } = useQuery(['getStaffs'], () =>
    getStaffs(baseParams),
  );

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (src: string) => (
        <Image src={src} width={40} height={40} style={{ borderRadius: 12 }} />
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
      render: (_, record: any) => (
        <ThreeDotsDropdown
          overlay={
            <Menu>
              <Menu.Item
                key="editPreferences"
                onClick={() => {
                  handleEditPreferences(record.key);
                }}
              >
                Edit Preferences
              </Menu.Item>
              <Menu.Item
                key="resetUserPassword"
                onClick={() => {
                  handleResetPassword(record.key);
                }}
              >
                Reset Password
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        />
      ),
    },
  ];

  const data: DataType[] = dataStaff
    ? dataStaff.data.data.map(user => {
        return {
          key: user.id,
          avatar: initImage,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          authentication: 'auth',
        };
      })
    : [];

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
          <CustomSpinSuspense spinning={isLoading}>
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
            />
          </CustomSpinSuspense>
        </div>
      </div>

      {showInviteModal && (
        <InviteMemberModal
          showModal={showInviteModal}
          setShowModal={setShowInviteModal}
        />
      )}
      {showEditPreferencesModal && (
        <InviteMemberModal
          userId={userId}
          showModal={showEditPreferencesModal}
          setShowModal={setShowEditPreferencesModal}
          edit
        />
      )}
      {showResetPasswordModal && (
        <ResetUserPassword
          userId={userId}
          showModal={showResetPasswordModal}
          setShowModal={setShowResetPasswordModal}
        />
      )}
    </TeamContentStyled>
  );
}

export default TeamContent;
