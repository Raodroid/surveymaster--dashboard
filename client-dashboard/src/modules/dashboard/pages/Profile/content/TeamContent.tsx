import {
  DeleteFilled,
  EyeOutlined,
  SettingFilled,
  UserDeleteOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  InputRef,
  Menu,
  notification,
  Pagination,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { CloseIcon } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import { GetTeamMembers } from 'interfaces';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import AdminService from 'services/bioandme-service/admin.service';
import { onError } from 'utils';
import { initImage } from '../sider/form/UserForm';
import {
  DropDownMenuStyled,
  TableWrapperStyled,
  TeamContentStyled,
} from '../styles';
import { InviteMemberModal, ResetUserPasswordModal } from './modals';

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
  const navigate = useNavigate();
  const profile = useSelector(AuthSelectors.getProfile);

  const searchRef = useRef<InputRef>(null);
  const [userId, setUserId] = useState('');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showInactivateUser, setShowInactivateUser] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showEditPreferencesModal, setShowEditPreferencesModal] =
    useState(false);

  const baseParams = useMemo(
    () => ({
      page: page,
      take: 10,
      roles: [1, 2, 3],
      isActivated: showInactivateUser,
      q: filter,
    }),
    [showInactivateUser, filter, page],
  );

  function getTeamMembers(params: GetTeamMembers): Promise<any> {
    return AdminService.getTeamMembers(params);
  }

  const { data: teamMembers, isLoading } = useQuery(
    ['getTeamMembers', showInactivateUser, filter],
    () => getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  console.log(teamMembers?.data);

  useEffect(() => {
    if (profile && !profile?.userRoles?.find(e => e.roleId === 1))
      navigate('/app');
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
              <DropDownMenuStyled>
                <Menu.Item
                  key="editPreferences"
                  onClick={() => {
                    handleEditPreferences(record.key);
                  }}
                >
                  <SettingFilled className="dropdown-icon" />{' '}
                  {t('common.editPreferences')}
                </Menu.Item>
                {profile && record.key !== profile.id && (
                  <Menu.Item
                    key="resetUserPassword"
                    onClick={() => {
                      handleResetPassword(record.key);
                    }}
                  >
                    <EyeOutlined className="dropdown-icon" />{' '}
                    {t('common.resetPassword')}
                  </Menu.Item>
                )}
                {(!showInactivateUser || !record.deleteAt) &&
                  profile &&
                  profile.id !== record.key && (
                    <Menu.Item
                      key="deactivateUser"
                      onClick={handleDeactivateUser}
                    >
                      <UserDeleteOutlined className="dropdown-icon" />{' '}
                      {t('common.deactivateUser')}
                    </Menu.Item>
                  )}
                {record.deleteAt && (
                  <Menu.Item key="restore" onClick={handleRestoreUser}>
                    <DeleteFilled className="dropdown-icon" />{' '}
                    {t('common.restore')}
                  </Menu.Item>
                )}
              </DropDownMenuStyled>
            }
            trigger={['click']}
            onOpenChange={() => {
              setUserId(record.key);
            }}
          />
        ),
      },
    ],
    [profile, handleRestoreUser, showInactivateUser, handleDeactivateUser, t],
  );

  const data: DataType[] = teamMembers
    ? teamMembers.data.data.map(user => {
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
      <div className="cell padding-24 name title">AMiLi</div>

      <div className="cell flex-column" style={{ flex: 1 }}>
        <div className="search padding-24 flex-center">
          <Button
            className="search-btn"
            onClick={() => {
              if (search.trim()) {
                setFilter(search);
              } else {
                searchRef.current?.focus();
              }
            }}
          >
            <SearchIcon />
          </Button>
          <Form
            onFinish={() => setFilter(search)}
            className="search-form flex-center"
          >
            <Input
              value={search}
              ref={searchRef}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Team Member..."
            />
            {search && (
              <Button
                className="clear-btn"
                onClick={() => {
                  setSearch('');
                }}
              >
                <CloseIcon />
              </Button>
            )}
          </Form>
          <Checkbox
            className="show-inactivate-users-checkbox"
            checked={showInactivateUser}
            onChange={() => setShowInactivateUser(!showInactivateUser)}
          >
            {t('common.showInactivateUsers')}
          </Checkbox>
          <Button type="primary" onClick={() => setShowInviteModal(true)}>
            {t('common.inviteMember')}
          </Button>
        </div>

        <Divider />

        <TableWrapperStyled>
          <CustomSpinSuspense spinning={isLoading}>
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              scroll={{ y: 'calc(100vh - 420px)' }}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
            <Pagination
              showSizeChanger={false}
              defaultCurrent={1}
              total={teamMembers?.data?.pageCount * 10 + 200}
            />
          </CustomSpinSuspense>
        </TableWrapperStyled>
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
            teamMembers
              ? teamMembers.data.data.find(user => user.id === userId)
              : {}
          }
          showModal={showEditPreferencesModal}
          setShowModal={setShowEditPreferencesModal}
          edit
        />
      )}
      {showResetPasswordModal && (
        <ResetUserPasswordModal
          userId={userId}
          showModal={showResetPasswordModal}
          setShowModal={setShowResetPasswordModal}
        />
      )}
    </TeamContentStyled>
  );
}

export default TeamContent;
