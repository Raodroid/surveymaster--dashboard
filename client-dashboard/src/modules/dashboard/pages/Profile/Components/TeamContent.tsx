import {
  Button,
  Checkbox,
  Divider,
  Image,
  Input,
  InputRef,
  Menu,
  notification,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { SearchIcon } from 'icons/SearchIcon';
import { CustomCheckbox } from 'modules/common/input/inputs';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Navigate, useNavigate } from 'react-router';
import { AdminService, UserService } from 'services';
import APIService from 'services/bioandme-service/base.service';
import { onError, useDebounce } from 'utils';
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
  const navigate = useNavigate();
  const searchRef = useRef<InputRef>(null);
  const debounceSearch = useDebounce(search);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditPreferencesModal, setShowEditPreferencesModal] =
    useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [showInactivateUser, setShowInactivateUser] = useState(false);

  const baseParams = useMemo(
    () => ({
      page: 1,
      take: 10,
      roles: [1, 2, 3, 4, 5, 7, 10],
      activated: showInactivateUser,
      firstName: debounceSearch,
      lastName: debounceSearch,
      email: debounceSearch,
      authentication: debounceSearch,
    }),
    [showInactivateUser, debounceSearch],
  );

  function getStaffs(params: any): Promise<any> {
    return APIService.get(`/users`, { params });
  }

  const { data: dataStaff, isLoading } = useQuery(
    ['getStaffs', showInactivateUser, debounceSearch],
    () => getStaffs(baseParams),
  );

  const { data: profile } = useQuery('me', UserService.getProfile);

  useEffect(() => {
    if (profile && !profile.data.roles.find(e => e === 1)) navigate('/app');
  }, [profile, navigate]);

  const mutationDeactivateUser = useMutation(
    () => {
      return AdminService.deactivateUser({
        userId,
      });
    },
    {
      onSuccess: () => notification.success(t('common.updateSuccess')),
      onError,
    },
  );

  const mutationRestoreUser = useMutation(
    () => {
      return AdminService.restoreUser({
        userId,
      });
    },
    {
      onSuccess: () => notification.success(t('common.updateSuccess')),
      onError,
    },
  );

  const handleDeactivateUser = useCallback(() => {
    mutationDeactivateUser.mutateAsync();
  }, [mutationDeactivateUser]);

  const handleRestoreUser = useCallback(() => {
    mutationRestoreUser.mutateAsync();
  }, [mutationRestoreUser]);

  const handleEditPreferences = (id: string) => {
    setUserId(id);
    setShowEditPreferencesModal(true);
  };

  const handleResetPassword = (id: string) => {
    setUserId(id);
    setShowResetPasswordModal(true);
  };

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'avatar',
        render: (src: string) => (
          <Image
            src={src}
            width={40}
            height={40}
            style={{ borderRadius: 12 }}
          />
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
                {profile && record.key !== profile.data.id && (
                  <Menu.Item
                    key="resetUserPassword"
                    onClick={() => {
                      handleResetPassword(record.key);
                    }}
                  >
                    Reset Password
                  </Menu.Item>
                )}
                {(!showInactivateUser || !record.deleteAt) &&
                  profile &&
                  profile.data.id !== record.key && (
                    <Menu.Item
                      key="deactivateUser"
                      onClick={handleDeactivateUser}
                    >
                      Deactivate User
                    </Menu.Item>
                  )}
                {record.deleteAt && (
                  <Menu.Item key="restore" onClick={handleRestoreUser}>
                    Restore
                  </Menu.Item>
                )}
              </Menu>
            }
            trigger={['click']}
            onOpenChange={() => {
              setUserId(record.key);
              console.log(userId, profile.data.id);
            }}
          />
        ),
      },
    ],
    [
      userId,
      profile,
      handleRestoreUser,
      showInactivateUser,
      handleDeactivateUser,
    ],
  );

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
          <Checkbox
            checked={showInactivateUser}
            onChange={() => setShowInactivateUser(!showInactivateUser)}
          >
            Show inactivate users
          </Checkbox>
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
          userData={
            dataStaff
              ? dataStaff.data.data.find(user => user.id === userId)
              : {}
          }
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
